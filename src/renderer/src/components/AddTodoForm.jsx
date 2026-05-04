import { useState } from 'react'
import PropTypes from 'prop-types'
import { useI18n } from '../contexts/I18nContext'

const inputClassName =
  'w-full h-[50px] px-6 py-0 rounded-md border border-app-input-border bg-app-input-bg text-app-input-text text-md font-medium placeholder:text-app-placeholder focus:outline-none focus:border-app-focus-border focus:shadow-[0_0_0_3px_var(--app-focus-ring)]'

const buttonClassName =
  'min-w-[50px] h-[50px] border rounded-md border-app-input-border bg-app-input-bg text-app-input-text text-xl font-semibold cursor-pointer transition-transform duration-200 hover:bg-app-button-hover-bg app-button-hover-shadow'

export function AddTodoForm({ onAdd }) {
  const { t } = useI18n()
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAdd(inputValue)
      setInputValue('')
    }
  }

  return (
    <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
      <input
        type="text"
        className={inputClassName}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={t('addTodoPlaceholder')}
      />
      <button type="submit" className={buttonClassName}>
        {t('addTodoSubmit')}
      </button>
    </form>
  )
}

AddTodoForm.propTypes = {
  onAdd: PropTypes.func.isRequired
}
