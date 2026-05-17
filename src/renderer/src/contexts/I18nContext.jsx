/* eslint-disable react-refresh/only-export-components -- context + hook pattern */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { messages, SUPPORTED_LOCALES } from '@/shared/locales'

const STORAGE_KEY = 'wuzi2do-locale'

const I18nContext = createContext(null)

function interpolate(template, params) {
  if (!params) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : ''
  )
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    // 优先从主进程同步获取语言设置
    try {
      if (window.api?.getInitialSettings) {
        const settings = window.api.getInitialSettings()
        if (SUPPORTED_LOCALES.includes(settings?.locale)) {
          return settings.locale
        }
      }
    } catch {
      /* ignore */
    }
    // 回退到本地存储
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (SUPPORTED_LOCALES.includes(stored)) return stored
    } catch {
      /* ignore */
    }
    return 'zh-CN'
  })

  useEffect(() => {
    document.documentElement.lang = locale === 'zh-CN' ? 'zh-CN' : 'en'
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
  }, [locale])

  // 监听来自托盘菜单的语言更改
  useEffect(() => {
    if (window.api?.onLocaleChanged) {
      window.api.onLocaleChanged((newLocale) => {
        if (SUPPORTED_LOCALES.includes(newLocale)) {
          setLocaleState(newLocale)
        }
      })
    }
  }, [])

  const setLocale = (next) => {
    if (SUPPORTED_LOCALES.includes(next)) setLocaleState(next)
  }

  const t = useCallback(
    (key, params) => {
      const table = messages[locale] ?? messages['zh-CN']
      const raw = table[key]
      if (typeof raw !== 'string') return key
      return interpolate(raw, params)
    },
    [locale]
  )

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}
