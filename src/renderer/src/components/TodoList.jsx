import PropTypes from 'prop-types'
import { useI18n } from '../contexts/I18nContext'

function TodoItem({ todo, onToggle, onRemove }) {
  const { t } = useI18n()
  const rowBase =
    'flex items-center justify-between gap-2.5 min-h-12.5 py-1.25 px-4 rounded-md border border-app-todo-border transition-colors duration-200'
  const rowState = todo.completed
    ? 'bg-app-todo-bg-done'
    : 'bg-app-todo-bg hover:bg-app-todo-bg-hover'
  const textBase =
    'cursor-pointer grow max-w-[calc(100%-40px)] text-app-todo-text text-base font-bold leading-tight wrap-break-word'
  const textDone = todo.completed ? 'line-through text-app-todo-text-done' : ''

  return (
    <li
      className={`${rowBase} ${rowState}`}
      onContextMenu={(e) => {
        e.preventDefault()
        onRemove(todo.id)
      }}
      title={t('todoContextTitle')}
    >
      <span className={`${textBase} ${textDone}`} onClick={() => onToggle(todo.id)}>
        {todo.text}
      </span>
      <input
        type="checkbox"
        className="todo-check"
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
    completed: PropTypes.bool.isRequired
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

export function TodoList({ todos, onToggle, onRemove }) {
  const { t } = useI18n()

  return (
    <ul className="list-none overflow-y-auto p-3 flex flex-col gap-3.5 todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove} />
      ))}
      {todos.length === 0 && (
        <li className="mt-2.5 text-center text-app-empty text-xl">{t('emptyTodos')}</li>
      )}
    </ul>
  )
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}
