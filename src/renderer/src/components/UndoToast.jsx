import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useI18n } from '../contexts/I18nContext'

export function UndoToast({ show, onUndo }) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
    } else {
      const timer = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!visible) return null

  return (
    <div
      className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2.5 rounded-md bg-app-toast-bg border border-app-toast-border shadow-lg backdrop-blur-[10px] transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span className="text-app-toast-text text-sm font-medium whitespace-nowrap">
        {t('todoDeleted')}
      </span>
      <button
        className="px-3 py-1 rounded-md bg-app-toast-btn-bg hover:bg-app-toast-btn-bg-hover text-app-toast-text text-xs font-semibold transition-colors cursor-pointer"
        onClick={onUndo}
      >
        {t('undo')}
      </button>
    </div>
  )
}

UndoToast.propTypes = {
  show: PropTypes.bool.isRequired,
  onUndo: PropTypes.func.isRequired
}
