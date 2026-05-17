import './assets/styles/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import { I18nProvider } from './contexts/I18nContext'

function bootstrapDocument() {
  try {
    const theme = localStorage.getItem('wuzi2do-theme')
    document.documentElement.dataset.theme = theme === 'dark' || theme === 'light' ? theme : 'light'
    const locale = localStorage.getItem('wuzi2do-locale')
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  } catch {
    document.documentElement.dataset.theme = 'light'
    document.documentElement.lang = 'zh-CN'
  }
}

bootstrapDocument()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>
)
