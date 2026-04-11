import PropTypes from 'prop-types'

function TodoItem({ todo, onToggle, onRemove }) {
  return (
    <li
      className={`flex items-center justify-between gap-2.5 min-h-[50px] py-1.25 px-4 rounded-md border transition-colors duration-200 ${todo.completed ? 'bg-[rgba(245,246,254,0.83)] border-[rgba(229,231,244,0.92)]' : 'bg-[rgba(245,246,254,0.83)] border-[rgba(229,231,244,0.92)] hover:bg-[rgba(249,250,255,0.95)]'}`}
      onContextMenu={(e) => {
        e.preventDefault()
        onRemove(todo.id)
      }}
      title="右键删除"
    >
      <span
        className={`cursor-pointer flex-grow max-w-[calc(100%-40px)] text-[#6a6582] text-base font-bold leading-tight break-words ${todo.completed ? 'line-through text-[#9e9ab4]' : ''}`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.text}
      </span>
      <input
        type="checkbox"
        className="todo-check"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`切换 ${todo.text}`}
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
  return (
    <ul className="list-none p-0 overflow-y-auto p-3 flex flex-col gap-3.5 todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove} />
      ))}
      {todos.length === 0 && (
        <li className="mt-2.5 text-center text-[#ffffff] text-2xl">no tasks, add one now</li>
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
