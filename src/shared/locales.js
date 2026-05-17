/**
 * 共享的多语言配置和托盘菜单文本
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
    openApp: '打开应用',
    theme: '主题',
    light: '浅色',
    dark: '深色',
    language: '语言',
    quit: '退出应用'
  },
  en: {
    openApp: 'Open Application',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    quit: 'Quit Application'
  }
}

/** @type {Record<string, Record<string, string>>} */
export const messages = {
  'zh-CN': {
    appTitle: '吾之所向',
    addTodoPlaceholder: '渐入',
    addTodoSubmit: '曰',
    emptyTodos: '未有所向，何以为安',
    todoAriaToggle: '更 {{text}}',
    todoContextTitle: '右键可删',
    filterAll: '全部',
    filterActive: '未竟',
    filterCompleted: '已成',
    searchPlaceholder: '寻索',
    priorityHigh: '上',
    priorityMedium: '中',
    priorityLow: '下',
    editPlaceholder: '修其名…',
    dragHandle: '可移',
    clearCompleted: '清已成',
    completedCount: '已成 {{count}}',
    activeCount: '尚余 {{count}}',
    todoDeleted: '已弃之',
    undo: '溯回'
  },
  en: {
    appTitle: 'My direction',
    addTodoPlaceholder: 'Add a task',
    addTodoSubmit: 'Add',
    emptyTodos: 'Nothing here yet',
    todoAriaToggle: 'Toggle {{text}}',
    todoContextTitle: 'Right-click to delete',
    filterAll: 'All',
    filterActive: 'Active',
    filterCompleted: 'Completed',
    searchPlaceholder: 'Search todos…',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    editPlaceholder: 'Edit todo…',
    dragHandle: 'Drag to reorder',
    clearCompleted: 'Clear completed',
    completedCount: '{{count}} completed',
    activeCount: '{{count}} remaining',
    todoDeleted: 'Deleted',
    undo: 'Undo'
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
