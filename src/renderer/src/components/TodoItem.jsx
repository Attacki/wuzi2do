import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useI18n } from '../contexts/I18nContext'

function TodoItem({ todo, onToggle, onRemove, onUpdate }) {
  const { t } = useI18n()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)
  const editRef = useRef(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus()
      editRef.current.select()
    }
  }, [editing])

  const handleDoubleClick = () => {
    setEditing(true)
    setEditValue(todo.text)
  }

  const handleEditBlur = () => {
    saveEdit()
  }

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      setEditing(false)
      setEditValue(todo.text)
    }
  }

  const saveEdit = () => {
    setEditing(false)
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== todo.text) {
      onUpdate(todo.id, { text: trimmed })
    } else {
      setEditValue(todo.text)
    }
  }

  const priorityColor = {
    high: 'bg-red-400/10 text-red-700 border-red-300/50',
    medium: 'bg-yellow-400/10 text-yellow-700 border-yellow-300/50',
    low: 'bg-green-400/10 text-green-700 border-green-300/50'
  }

  const priorityLabel = {
    high: t('priorityHigh'),
    medium: t('priorityMedium'),
    low: t('priorityLow')
  }

  const rowBg = todo.completed ? 'bg-app-todo-bg-done' : 'bg-app-todo-bg hover:bg-app-todo-bg-hover'

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-1.5 py-2.5 px-2 rounded-md border border-app-todo-border overflow-hidden ${rowBg}`}
      onContextMenu={(e) => {
        e.preventDefault()
        onRemove(todo.id)
      }}
      title={t('todoContextTitle')}
    >
      <button
        className="cursor-grab active:cursor-grabbing text-app-placeholder hover:text-app-todo-text transition-colors p-0.5 text-lg leading-none select-none touch-none shrink-0"
        {...attributes}
        {...listeners}
        aria-label={t('dragHandle')}
        tabIndex={-1}
      >
        &#x2807;
      </button>

      <span
        className={`text-[10px] font-bold px-2 py-1 rounded-full border leading-none shrink-0  ${priorityColor[todo.priority] || priorityColor.medium}`}
      >
        {priorityLabel[todo.priority] || priorityLabel.medium}
      </span>

      {editing ? (
        <textarea
          ref={editRef}
          type="text"
          className="flex-grow min-w-0 h-40 px-2 overflow-auto hide-scrollbar rounded-md border border-app-focus-border bg-app-input-bg text-app-input-text text-base font-bold outline-none shadow-[0_0_0_2px_var(--app-focus-ring)]"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditBlur}
          onKeyDown={handleEditKeyDown}
          placeholder={t('editPlaceholder')}
        />
      ) : (
        <span className="relative grow max-w-[calc(100%-40px)] transition-all duration-300 ease-in-out min-h-[20px] max-h-[20px] hover:max-h-40 overflow-auto hide-scrollbar">
          <span
            className={`block cursor-pointer text-app-todo-text text-base font-bold leading-tight break-words line-clamp-2 group-hover:line-clamp-none ${
              todo.completed ? 'line-through text-app-todo-text-done' : ''
            }`}
            onDoubleClick={handleDoubleClick}
          >
            {todo.text}
          </span>
        </span>
      )}

      <input
        type="checkbox"
        className="todo-check shrink-0"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={t('todoAriaToggle', { text: todo.text })}
      />
    </li>
  )
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    priority: PropTypes.string,
    createdAt: PropTypes.number
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
}

export default TodoItem
