/**
 * Slide2do 主进程入口
 * 
 * 职责：
 * 1. 应用初始化和生命周期管理
 * 2. 协调各个管理器模块
 * 3. 注册 IPC 通信处理器
 */

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 配置和存储
import { WINDOW_CONFIG } from './config/constants.js'
import { getStoredLocale, getStoredTheme, setStoredLocale, setStoredTheme } from './config/store.js'

// 管理器
import { createSnapManager } from './managers/snapManager.js'
import { createTrayManager } from './managers/trayManager.js'

// ========== 全局状态 ==========
let mainWindow = null
let snapManager = null
let trayManager = null
let currentLocale = getStoredLocale()
let currentTheme = getStoredTheme()

// ========== 窗口创建 ==========

/**
 * 创建主窗口
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: WINDOW_CONFIG.initWidth,
    height: WINDOW_CONFIG.initHeight,
    // Windows 无边框窗口有隐式最小尺寸；设为 1 以便 setBounds 可以小于默认限制
    minWidth: WINDOW_CONFIG.minWidth,
    minHeight: WINDOW_CONFIG.minHeight,
    show: false,
    resizable: false,
    skipTaskbar: true,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  // 窗口准备好后显示
  mainWindow.on('ready-to-show', () => {
    mainWindow.setMinimumSize(1, 1)
    mainWindow.show()
  })

  // 监听窗口移动，用于边缘吸附
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

  return mainWindow
}

// ========== 管理器初始化 ==========

/**
 * 初始化吸附管理器
 */
function initSnapManager() {
  snapManager = createSnapManager({
    mainWindow,
    // 吸附状态变化时通知渲染进程
    onSnapChange: (snapped, direction) => {
      mainWindow.webContents.send('window-snap', { snapped, direction })
    }
  })
}

/**
 * 初始化托盘管理器
 */
function initTrayManager() {
  trayManager = createTrayManager({
    mainWindow,
    getLocale: () => currentLocale,
    setLocale: (locale) => {
      currentLocale = locale
      setStoredLocale(locale)
    },
    getTheme: () => currentTheme,
    setTheme: (theme) => {
      currentTheme = theme
      setStoredTheme(theme)
    },
    // 语言变化时通知渲染进程
    onLocaleChange: (locale) => {
      mainWindow.webContents.send('locale-changed', locale)
      // 更新托盘菜单
      trayManager.updateTrayMenu()
    },
    // 主题变化时通知渲染进程
    onThemeChange: (theme) => {
      mainWindow.webContents.send('theme-changed', theme)
      // 更新托盘菜单
      trayManager.updateTrayMenu()
    }
  })

  trayManager.create()
}

// ========== IPC 处理器 ==========

/**
 * 注册 IPC 通信处理器
 */
function registerIpcHandlers() {
  ipcMain.on('minimize-app', () => {
    mainWindow.minimize()
  })

  ipcMain.on('close-app', () => {
    app.quit()
  })
}

// ========== 应用生命周期 ==========

app.whenReady().then(() => {
  // 设置应用 ID（Windows 通知必需）
  electronApp.setAppUserModelId('com.electron')

  // 监听窗口创建，优化窗口快捷键
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 创建窗口和初始化管理器
  createWindow()
  initSnapManager()
  initTrayManager()
  registerIpcHandlers()

  // macOS 激活事件
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 所有窗口关闭时退出（非 macOS）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
