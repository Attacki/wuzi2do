/**
 * 系统托盘管理器
 * 负责托盘图标创建、菜单构建和事件处理
 */

import { Menu, Tray, app } from 'electron'
import icon from '../../../resources/icon-app-tray.png?asset'
import { trayMessages, t, SUPPORTED_LOCALES, SUPPORTED_THEMES } from '@shared/locales'

/**
 * 创建托盘管理器实例
 * @param {object} options - 配置选项
 * @param {BrowserWindow} options.mainWindow - 主窗口引用
 * @param {function} options.getLocale - 获取当前语言的函数
 * @param {function} options.setLocale - 设置语言的函数
 * @param {function} options.getTheme - 获取当前主题的函数
 * @param {function} options.setTheme - 设置主题的函数
 * @param {function} options.onLocaleChange - 语言变化回调 (locale: string) => void
 * @param {function} options.onThemeChange - 主题变化回调 (theme: string) => void
 * @returns {object} 托盘管理器实例
 */
export function createTrayManager({
  mainWindow,
  getLocale,
  setLocale,
  getTheme,
  setTheme,
  onLocaleChange,
  onThemeChange
}) {
  let tray = null

  /**
   * 聚焦并显示主窗口
   */
  function focusMainWindow() {
    if (mainWindow.isDestroyed()) return
    if (!mainWindow.isVisible()) mainWindow.show()
    mainWindow.showInactive()
    mainWindow.setAlwaysOnTop(true)
    mainWindow.focus()
  }

  /**
   * 构建托盘上下文菜单模板
   * @returns {Array} 菜单模板数组
   */
  function buildMenuTemplate() {
    const currentLocale = getLocale()
    const currentTheme = getTheme()
    const msg = trayMessages[currentLocale] || trayMessages['zh-CN']

    return [
      // 打开 Todos
      {
        label: msg.openApp,
        type: 'normal',
        click: focusMainWindow
      },
      { type: 'separator' },
      // 主题子菜单
      {
        label: msg.theme,
        submenu: [
          {
            label: msg.light,
            type: 'radio',
            checked: currentTheme === 'light',
            click: () => {
              setTheme('light')
              if (onThemeChange) onThemeChange('light')
              updateTrayMenu()
            }
          },
          {
            label: msg.dark,
            type: 'radio',
            checked: currentTheme === 'dark',
            click: () => {
              setTheme('dark')
              if (onThemeChange) onThemeChange('dark')
              updateTrayMenu()
            }
          }
        ]
      },
      // 语言子菜单
      {
        label: msg.language,
        submenu: SUPPORTED_LOCALES.map((locale) => ({
          label: locale === 'zh-CN' ? '中文' : 'English',
          type: 'radio',
          checked: currentLocale === locale,
          click: () => {
            setLocale(locale)
            if (onLocaleChange) onLocaleChange(locale)
            updateTrayMenu()
          }
        }))
      },
      { type: 'separator' },
      // 退出
      {
        label: msg.quit,
        type: 'normal',
        click: () => {
          app.quit()
        }
      }
    ]
  }

  /**
   * 更新托盘菜单
   */
  function updateTrayMenu() {
    if (!tray) return
    const template = buildMenuTemplate()
    tray.setContextMenu(Menu.buildFromTemplate(template))
  }

  /**
   * 创建托盘图标
   */
  function create() {
    tray = new Tray(icon)
    tray.setToolTip('Slide2do')
    updateTrayMenu()

    // 点击托盘图标聚焦窗口
    tray.on('click', focusMainWindow)

    return tray
  }

  /**
   * 获取托盘实例
   * @returns {Tray|null}
   */
  function getTray() {
    return tray
  }

  return {
    create,
    getTray,
    updateTrayMenu,
    focusMainWindow
  }
}
