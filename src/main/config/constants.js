/**
 * 应用常量配置
 * 集中管理窗口和吸附相关的配置
 * 
 * 注意：语言和主题配置已移至 @shared/locales.js
 * 此文件仅包含窗口和吸附相关的配置
 */

import {
  SUPPORTED_LOCALES,
  SUPPORTED_THEMES,
  DEFAULT_SETTINGS,
  STORE_KEYS
} from '@shared/locales'

/** 窗口初始尺寸配置 */
export const WINDOW_CONFIG = {
  initWidth: 450,
  initHeight: 650,
  /** Windows 无边框窗口的隐式最小尺寸限制 */
  minWidth: 1,
  minHeight: 1
}

/** 窗口吸附配置 */
export const SNAP_CONFIG = {
  /** 边缘吸附阈值（像素） */
  threshold: 5,
  /** 卷起/展开动画延迟（毫秒） */
  animationDelay: 500,
  /** 鼠标位置轮询间隔（毫秒） */
  pollInterval: 100
}

/** 吸附方向枚举 */
export const SNAP_DIRECTIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
}

// 重新导出共享配置，方便其他模块使用
export { SUPPORTED_LOCALES, SUPPORTED_THEMES, DEFAULT_SETTINGS, STORE_KEYS }
