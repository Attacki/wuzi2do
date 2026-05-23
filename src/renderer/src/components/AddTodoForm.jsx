import { useState } from 'react'
import PropTypes from 'prop-types'
import { useI18n } from '../contexts/I18nContext'

const priorities = [
  {
    key: 'high',
    labelKey: 'priorityHigh',
    className: 'bg-red-400/10 text-red-700 border-red-300/50'
  },
  {
    key: 'medium',
    labelKey: 'priorityMedium',
    className: 'bg-yellow-400/10 text-yellow-700 border-yellow-300/50'
  },
  {
    key: 'low',
    labelKey: 'priorityLow',
    className: 'bg-green-400/10 text-green-700 border-green-300/50'
  }
]

const inputClassName =
  'flex-1 h-[60px] overflow-auto hide-scrollbar py-1.5 px-4 rounded-md border border-app-input-border bg-app-input-bg text-app-input-text text-base font-medium placeholder:text-app-placeholder focus:outline-none focus:border-app-focus-border focus:shadow-[0_0_0_3px_var(--app-focus-ring)]'

const buttonClassName =
  'h-[50px] min-w-[50px] border rounded-md border-app-input-border bg-app-input-bg text-app-input-text text-xl font-semibold cursor-pointer transition-transform duration-200 hover:bg-app-button-hover-bg app-button-hover-shadow'

export function AddTodoForm({ onAdd }) {
  const { t } = useI18n()
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState('high')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAdd(inputValue.trim(), priority)
      setInputValue('')
      setPriority('high')
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="flex gap-2 items-center">
        <textarea
          type="text"
          className={inputClassName}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t('addTodoPlaceholder')}
        />
        <button type="submit" className={buttonClassName}>
          {t('addTodoSubmit')}
        </button>
      </div>
      <div className="flex justify-start gap-2">
        {priorities.map(({ key, labelKey, className: priorityClass }) => (
          <button
            key={key}
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer transition-all ${
              priority === key
                ? `${priorityClass}`
                : 'border-transparent text-app-placeholder hover:text-app-todo-text hover:bg-[rgba(138,130,173,0.1)]'
            }`}
            onClick={() => setPriority(key)}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
    </form>
  )
}

AddTodoForm.propTypes = {
  onAdd: PropTypes.func.isRequired
}
