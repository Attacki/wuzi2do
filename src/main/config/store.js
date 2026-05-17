/**
 * Store 配置模块
 * 封装 electron-store 的初始化和常用操作
 */

import Store from 'electron-store'
import { SUPPORTED_LOCALES, SUPPORTED_THEMES, DEFAULT_SETTINGS, STORE_KEYS } from '@/shared/locales'

// 初始化 Store 实例
const store = new Store({
  name: 'wuzi2do-settings',
  defaults: DEFAULT_SETTINGS
})

/**
 * 获取存储的语言设置
 * @returns {string} 支持的语言代码 ('zh-CN' | 'en')
 */
export function getStoredLocale() {
  const stored = store.get(STORE_KEYS.locale)
  return SUPPORTED_LOCALES.includes(stored) ? stored : DEFAULT_SETTINGS.locale
}

/**
 * 设置语言
 * @param {string} locale - 语言代码
 */
export function setStoredLocale(locale) {
  if (SUPPORTED_LOCALES.includes(locale)) {
    store.set(STORE_KEYS.locale, locale)
  }
}

/**
 * 获取存储的主题设置
 * @returns {string} 支持的主题 ('light' | 'dark')
 */
export function getStoredTheme() {
  const stored = store.get(STORE_KEYS.theme)
  return SUPPORTED_THEMES.includes(stored) ? stored : DEFAULT_SETTINGS.theme
}

/**
 * 设置主题
 * @param {string} theme - 主题名称
 */
export function setStoredTheme(theme) {
  if (SUPPORTED_THEMES.includes(theme)) {
    store.set(STORE_KEYS.theme, theme)
  }
}

/**
 * 获取 Store 实例（用于需要直接访问的场景）
 * @returns {Store} electron-store 实例
 */
export function getStore() {
  return store
}

// 重新导出共享配置
export { SUPPORTED_LOCALES, SUPPORTED_THEMES, DEFAULT_SETTINGS, STORE_KEYS }

export default store
