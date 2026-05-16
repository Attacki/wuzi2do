/**
 * 共享的多语言配置和托盘菜单文本
 * 
 * 此文件是 messages.js 的镜像，专为主进程使用
 * 在 vite 配置中被 alias 到 @shared，可被 main/preload/renderer 共同访问
 * 
 * @shared 对应 src/shared/ 目录
 */

/** 支持的语言列表 */
export const SUPPORTED_LOCALES = ['zh-CN', 'en']

/** 支持的主题列表 */
export const SUPPORTED_THEMES = ['light', 'dark']

/** 默认设置 */
export const DEFAULT_SETTINGS = {
  locale: 'zh-CN',
  theme: 'light'
}

/** Store 存储键名 */
export const STORE_KEYS = {
  locale: 'locale',
  theme: 'theme'
}

/** 托盘菜单翻译文本 */
export const trayMessages = {
  'zh-CN': {
    openApp: '打开 Todos',
    theme: '主题',
    light: '浅色',
    dark: '深色',
    language: '语言',
    quit: '退出 Todos'
  },
  en: {
    openApp: 'Open Todos',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    quit: 'Quit Todos'
  }
}


/** @type {Record<string, Record<string, string>>} */
export const messages = {
  'zh-CN': {
    appTitle: '吾之所向',
    addTodoPlaceholder: '渐入',
    addTodoSubmit: '曰',
    emptyTodos: '未有所向，何以为安',
    todoAriaToggle: '切换 {{text}}',
    todoContextTitle: '右键删除此项'
  },
  en: {
    appTitle: 'My direction',
    addTodoPlaceholder: 'Add a task',
    addTodoSubmit: 'Add',
    emptyTodos: 'Nothing here yet',
    todoAriaToggle: 'Toggle {{text}}',
    todoContextTitle: 'Right-click to delete'
  }
}


/**
 * 获取托盘菜单文本
 * @param {string} locale - 当前语言
 * @param {string} key - 文本键名
 * @returns {string} 翻译后的文本
 */
export function t(key, locale = 'zh-CN') {
  const messages = trayMessages[locale] || trayMessages['zh-CN']
  return messages[key] || key
}
