/**
 * 窗口吸附管理器
 * 负责处理窗口吸附到屏幕边缘、卷起/展开效果
 */

import { screen } from 'electron'
import { WINDOW_CONFIG, SNAP_CONFIG } from '../config/constants.js'
import { clearRolledShape, applyRolledShape, rolledHitScreenRect, pointInRect } from '../utils/windowShape.js'

/**
 * 创建吸附管理器实例
 * @param {object} options - 配置选项
 * @param {BrowserWindow} options.mainWindow - 主窗口引用
 * @param {function} options.onSnapChange - 吸附状态变化回调 (snapped: boolean, direction: string) => void
 * @returns {object} 吸附管理器实例
 */
export function createSnapManager({ mainWindow, onSnapChange }) {
  const manager = {
    /** 当前吸附状态 */
    state: {
      direction: null,
      isSnapped: false
    },
    /** 鼠标轮询定时器 */
    mousePollInterval: null,

    /**
     * 清理吸附状态
     * 移除卷起形状、恢复窗口大小、清除定时器
     */
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
        this.notifySnapChange(false, oldDirection)
      }
    },

    /**
     * 根据方向计算卷起后的窗口边界
     * @param {string} direction - 吸附方向
     * @param {object} currentBounds - 当前窗口边界
     * @returns {object} 新的窗口边界
     */
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

    /**
     * 根据方向计算展开后的窗口边界
     * @param {string} direction - 吸附方向
     * @param {object} currentBounds - 当前窗口边界
     * @param {object} workArea - 工作区域
     * @returns {object} 恢复后的窗口边界
     */
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

    /**
     * 设置新的吸附
     * @param {string} direction - 吸附方向
     */
    setup(direction) {
      this.state = { direction, isSnapped: true }

      // 初始卷起动画
      this.notifySnapChange(true, direction)

      setTimeout(() => {
        if (this.state.isSnapped) {
          const bounds = mainWindow.getBounds()
          const newBounds = this.calculateRolledBounds(direction, bounds)
          mainWindow.setMinimumSize(1, 1)
          mainWindow.setBounds(newBounds)
          applyRolledShape(mainWindow, direction, SNAP_CONFIG.threshold)
        }
      }, SNAP_CONFIG.animationDelay)

      // 启动鼠标悬停检测
      this.startMousePolling(direction)
    },

    /**
     * 通知吸附状态变化
     * @param {boolean} snapped - 是否吸附
     * @param {string} direction - 吸附方向
     */
    notifySnapChange(snapped, direction) {
      if (onSnapChange) {
        onSnapChange(snapped, direction)
      }
    },

    /**
     * 开始鼠标位置轮询
     * 检测鼠标是否进入/离开卷起的窗口，实现自动展开/卷起
     * @param {string} direction - 当前吸附方向
     */
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
          this.notifySnapChange(false, direction)
          setTimeout(() => (isAnimating = false), SNAP_CONFIG.animationDelay)
        }
        // 鼠标离开展开的窗口 -> 卷起
        else if (!isInside && !isRolledUp) {
          isAnimating = true
          this.notifySnapChange(true, direction)
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

    /**
     * 处理窗口移动事件
     * 检测窗口是否移动到屏幕边缘，触发吸附
     */
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

  return manager
}
