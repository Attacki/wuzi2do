/**
 * 多语言消息和共享配置
 * 
 * 注意：此文件同时被主进程和渲染进程使用
 * - 渲染进程：直接导入
 * - 主进程：通过 src/shared/locales.js 间接使用
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
