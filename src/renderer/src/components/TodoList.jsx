import PropTypes from 'prop-types'

function TodoItem({ todo, onToggle, onRemove }) {
  return (
    <li
      className={`flex items-center justify-between gap-2.5 min-h-12.5 py-1.25 px-4 rounded-md border border-[rgba(194,194,194,0.92)] transition-colors duration-200 ${todo.completed ? 'bg-[rgba(241,241,241,0.83)]' : 'bg-[rgba(255,255,255,0.83)] hover:bg-[rgba(249,250,255,0.95)]'}`}
      onContextMenu={(e) => {
        e.preventDefault()
        onRemove(todo.id)
      }}
      title="right click and delete this item"
    >
      <span
        className={`cursor-pointer grow max-w-[calc(100%-40px)] text-[#2d2d2d] text-base font-bold leading-tight wrap-break-word ${todo.completed ? 'line-through text-[#b0b0b0]' : ''}`}
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
        <li className="mt-2.5 text-center text-[#717171] text-xl">未有所向，何以为安</li>
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
