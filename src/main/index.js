import { app, shell, BrowserWindow, Menu, ipcMain, Tray, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// ========== 常量配置 ==========
const WINDOW_CONFIG = {
  initWidth: 450,
  initHeight: 650
}

const SNAP_CONFIG = {
  threshold: 5,
  animationDelay: 500,
  pollInterval: 100
}

/** Windows 无边框窗口无法用 setBounds/setMinimumSize 突破系统隐式最小尺寸，需用 setShape 裁剪命中区（见 electron#32302）。 */
function clearRolledShape(win) {
  if (process.platform !== 'win32' || !win || win.isDestroyed()) return
  win.setShape([])
}

function applyRolledShape(win, direction, threshold) {
  if (process.platform !== 'win32' || win.isDestroyed()) return
  const { width: w, height: h } = win.getBounds()
  const t = Math.max(1, Math.round(threshold))
  let rects
  switch (direction) {
    case 'top':
      rects = [{ x: 0, y: 0, width: w, height: Math.min(t, h) }]
      break
    case 'bottom':
      rects = [{ x: 0, y: Math.max(0, h - t), width: w, height: Math.min(t, h) }]
      break
    case 'left':
      rects = [{ x: 0, y: 0, width: Math.min(t, w), height: h }]
      break
    case 'right':
      rects = [{ x: Math.max(0, w - t), y: 0, width: Math.min(t, w), height: h }]
      break
    default:
      rects = []
  }
  win.setShape(rects.length ? rects : [])
}

/** 卷起条在屏幕上的命中矩形（Win 上 getBounds 可能仍为大窗口，与 setShape 一致） */
function rolledHitScreenRect(direction, bounds, threshold) {
  const { x, y, width: w, height: h } = bounds
  const t = Math.max(1, threshold)
  switch (direction) {
    case 'top':
      return { x, y, width: w, height: Math.min(t, h) }
    case 'bottom':
      return { x, y: y + h - t, width: w, height: Math.min(t, h) }
    case 'left':
      return { x, y, width: Math.min(t, w), height: h }
    case 'right':
      return { x: x + w - t, y, width: Math.min(t, w), height: h }
    default:
      return bounds
  }
}

function pointInRect(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
}

// ========== 全局状态 ==========
let mainWindow = null
let tray = null

// ========== 窗口吸附管理器 ==========
const snapManager = {
  state: { direction: null, isSnapped: false },
  mousePollInterval: null,

  // 清理吸附状态
  cleanup() {
    if (!this.state.isSnapped) return

    clearRolledShape(mainWindow)

    const oldDirection = this.state.direction
    this.state = { direction: null, isSnapped: false }

    if (this.mousePollInterval) {
      clearInterval(this.mousePollInterval)
      this.mousePollInterval = null
    }

    // 确保窗口恢复到正常大小
    const bounds = mainWindow.getBounds()
    if (bounds.height < WINDOW_CONFIG.initHeight || bounds.width < WINDOW_CONFIG.initWidth) {
      mainWindow.setBounds({
        ...bounds,
        width: WINDOW_CONFIG.initWidth,
        height: WINDOW_CONFIG.initHeight
      })
      mainWindow.webContents.send('window-snap', {
        snapped: false,
        direction: oldDirection
      })
    }
  },

  // 根据方向计算卷起后的窗口边界
  calculateRolledBounds(direction, currentBounds) {
    const { threshold } = SNAP_CONFIG
    const newBounds = { ...currentBounds }

    switch (direction) {
      case 'top':
        newBounds.height = threshold
        break
      case 'bottom':
        newBounds.y = currentBounds.y + currentBounds.height - threshold
        newBounds.height = threshold
        break
      case 'left':
        newBounds.width = threshold
        break
      case 'right':
        newBounds.x = currentBounds.x + currentBounds.width - threshold
        newBounds.width = threshold
        break
    }

    return newBounds
  },

  // 根据方向计算展开后的窗口边界
  calculateExpandedBounds(direction, currentBounds, workArea) {
    const { initWidth, initHeight } = WINDOW_CONFIG
    const restoreBounds = { width: initWidth, height: initHeight }

    switch (direction) {
      case 'top':
        restoreBounds.x = currentBounds.x
        restoreBounds.y = workArea.y
        break
      case 'bottom':
        restoreBounds.x = currentBounds.x
        restoreBounds.y = workArea.y + workArea.height - initHeight
        break
      case 'left':
        restoreBounds.x = workArea.x
        restoreBounds.y = currentBounds.y
        break
      case 'right':
        restoreBounds.x = workArea.x + workArea.width - initWidth
        restoreBounds.y = currentBounds.y
        break
    }

    return restoreBounds
  },

  // 设置新的吸附
  setup(direction) {
    this.state = { direction, isSnapped: true }

    // 初始卷起动画
    mainWindow.webContents.send('window-snap', { snapped: true, direction })
    setTimeout(() => {
      if (this.state.isSnapped) {
        const bounds = mainWindow.getBounds()
        const newBounds = this.calculateRolledBounds(direction, bounds)
        mainWindow.setMinimumSize(1, 1)
        mainWindow.setBounds(newBounds)
        applyRolledShape(mainWindow, direction, SNAP_CONFIG.threshold)
      }
    }, SNAP_CONFIG.animationDelay)

    // 鼠标悬停检测逻辑
    this.startMousePolling(direction)
  },

  // 开始鼠标轮询
  startMousePolling(direction) {
    let isAnimating = false

    this.mousePollInterval = setInterval(() => {
      if (!this.state.isSnapped || isAnimating) return

      const cursor = screen.getCursorScreenPoint()
      const bounds = mainWindow.getBounds()
      const { initWidth, initHeight } = WINDOW_CONFIG
      const isRolledUp = bounds.height < initHeight || bounds.width < initWidth

      const hitRect =
        process.platform === 'win32' && isRolledUp
          ? rolledHitScreenRect(direction, bounds, SNAP_CONFIG.threshold)
          : bounds
      const isInside = pointInRect(cursor.x, cursor.y, hitRect)

      // 鼠标进入卷起的窗口 -> 展开
      if (isInside && isRolledUp) {
        isAnimating = true
        const display = screen.getDisplayMatching(bounds)
        const restoreBounds = this.calculateExpandedBounds(direction, bounds, display.workArea)
        clearRolledShape(mainWindow)
        mainWindow.setBounds(restoreBounds)
        mainWindow.webContents.send('window-snap', { snapped: false, direction })
        setTimeout(() => (isAnimating = false), SNAP_CONFIG.animationDelay)
      }
      // 鼠标离开展开的窗口 -> 卷起
      else if (!isInside && !isRolledUp) {
        isAnimating = true
        mainWindow.webContents.send('window-snap', { snapped: true, direction })
        setTimeout(() => {
          if (this.state.isSnapped) {
            const currentBounds = mainWindow.getBounds()
            const newBounds = this.calculateRolledBounds(direction, currentBounds)
            mainWindow.setMinimumSize(1, 1)
            mainWindow.setBounds(newBounds)
            applyRolledShape(mainWindow, direction, SNAP_CONFIG.threshold)
          }
          isAnimating = false
        }, SNAP_CONFIG.animationDelay)
      }
    }, SNAP_CONFIG.pollInterval)
  },

  // 处理窗口移动事件
  handleWindowMove() {
    const bounds = mainWindow.getBounds()
    const display = screen.getDisplayMatching(bounds)
    const workArea = display.workArea
    const { threshold } = SNAP_CONFIG
    const { initWidth, initHeight } = WINDOW_CONFIG

    let newSnappedDirection = null
    let { x, y, width, height } = bounds
    let newX = x
    let newY = y

    // 边缘检测（后面的条件会覆盖前面的，用于处理角落情况）
    if (x + width > workArea.x + workArea.width - threshold) {
      newSnappedDirection = 'right'
      newX = workArea.x + workArea.width - width
    }
    if (x < workArea.x + threshold) {
      newSnappedDirection = 'left'
      newX = workArea.x
    }
    if (y + height > workArea.y + workArea.height - threshold) {
      newSnappedDirection = 'bottom'
      newY = workArea.y + workArea.height - height
    }
    if (y < workArea.y + threshold) {
      newSnappedDirection = 'top'
      newY = workArea.y
    }

    // 应用吸附移动
    if (newX !== x || newY !== y) {
      clearRolledShape(mainWindow)
      mainWindow.setBounds({ x: newX, y: newY, width: initWidth, height: initHeight })
    }

    // 状态转换逻辑
    if (newSnappedDirection !== this.state.direction) {
      this.cleanup()
      if (newSnappedDirection) {
        this.setup(newSnappedDirection)
      }
    }
  }
}

// ========== 窗口创建 ==========
function createWindow() {
  mainWindow = new BrowserWindow({
    width: WINDOW_CONFIG.initWidth,
    height: WINDOW_CONFIG.initHeight,
    // Windows 无边框窗口有隐式最小尺寸；不设则 setBounds 无法小于约 50px。
    minWidth: 1,
    minHeight: 1,
    show: false,
    resizable: false,
    skipTaskbar: true,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.setMinimumSize(1, 1)
    mainWindow.show()
  })

  // 设置窗口吸附
  mainWindow.on('moved', () => snapManager.handleWindowMove())

  // 失去焦点时保持置顶
  mainWindow.on('blur', () => {
    mainWindow.setAlwaysOnTop(true)
  })

  // 阻止打开新窗口，改为外部浏览器打开
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 加载页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ========== 系统托盘 ==========
function createTray() {
  tray = new Tray(icon)

  const focusMainWindow = () => {
    if (mainWindow.isDestroyed()) return
    if (!mainWindow.isVisible()) mainWindow.show()
    mainWindow.showInactive()
    mainWindow.setAlwaysOnTop(true)
    mainWindow.focus()
  }

  tray.on('click', focusMainWindow)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开 Todos',
      type: 'normal',
      click: focusMainWindow
    },
    {
      label: '退出 Todos',
      type: 'normal',
      click: () => app.quit()
    }
  ])

  tray.setToolTip('Slide2do')
  tray.setContextMenu(contextMenu)
}

// ========== IPC 处理器 ==========
function registerIpcHandlers() {
  ipcMain.on('minimize-app', () => {
    mainWindow.minimize()
  })

  ipcMain.on('close-app', () => {
    app.quit()
  })
}

// ========== 应用初始化 ==========
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  createTray()
  registerIpcHandlers()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 退出逻辑
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
