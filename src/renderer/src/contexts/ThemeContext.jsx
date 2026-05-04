/* eslint-disable react-refresh/only-export-components -- context + hook pattern */
import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const STORAGE_KEY = 'slide2do-theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'dark' || stored === 'light') return stored
    } catch {
      /* ignore */
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  // 监听来自托盘菜单的主题更改
  useEffect(() => {
    if (window.api?.onThemeChanged) {
      window.api.onThemeChanged((newTheme) => {
        if (newTheme === 'dark' || newTheme === 'light') {
          setThemeState(newTheme)
        }
      })
    }
  }, [])

  const setTheme = (next) => {
    if (next === 'dark' || next === 'light') setThemeState(next)
  }

  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
