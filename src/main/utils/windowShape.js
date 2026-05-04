/**
 * 窗口形状操作工具模块
 * 处理 Windows 平台下的无边框窗口卷起效果
 *
 * 由于 Windows 无边框窗口无法用 setBounds/setMinimumSize 突破系统隐式最小尺寸，
 * 需用 setShape 裁剪命中区来实现卷起条效果（见 electron#32302）
 */

import { SNAP_CONFIG } from '../config/constants.js'

/**
 * 清除窗口形状，恢复正常窗口
 * @param {BrowserWindow} win - Electron 窗口实例
 */
export function clearRolledShape(win) {
  if (process.platform !== 'win32' || !win || win.isDestroyed()) return
  win.setShape([])
}

/**
 * 应用卷起形状到窗口
 * @param {BrowserWindow} win - Electron 窗口实例
 * @param {string} direction - 卷起方向 ('top' | 'bottom' | 'left' | 'right')
 * @param {number} threshold - 卷起条厚度（像素）
 */
export function applyRolledShape(win, direction, threshold = SNAP_CONFIG.threshold) {
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

/**
 * 计算卷起条在屏幕上的命中矩形
 * Windows 上 getBounds 可能仍返回大窗口尺寸，需与 setShape 一致
 *
 * @param {string} direction - 卷起方向
 * @param {object} bounds - 窗口边界 {x, y, width, height}
 * @param {number} threshold - 卷起条厚度（像素）
 * @returns {object} 命中矩形 {x, y, width, height}
 */
export function rolledHitScreenRect(direction, bounds, threshold = SNAP_CONFIG.threshold) {
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

/**
 * 检测点是否在矩形内
 * @param {number} px - 点 X 坐标
 * @param {number} py - 点 Y 坐标
 * @param {object} rect - 矩形 {x, y, width, height}
 * @returns {boolean} 是否在矩形内
 */
export function pointInRect(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
}
