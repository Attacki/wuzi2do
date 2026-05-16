import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TodoItem from './TodoItem'
import { useI18n } from '../contexts/I18nContext'

function TodoFilters({ filter, onFilterChange, searchQuery, onSearchChange }) {
  const { t } = useI18n()
  const filters = [
    { key: 'all', label: t('filterAll') },
    { key: 'active', label: t('filterActive') },
    { key: 'completed', label: t('filterCompleted') }
  ]

  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <input
        type="text"
        className="flex-1 h-8 px-3 rounded-md border border-app-input-border bg-app-input-bg text-app-todo-text text-sm font-medium placeholder:text-app-placeholder focus:outline-none focus:border-app-focus-border"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t('searchPlaceholder')}
      />
      <div className="flex gap-1 shrink-0">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${
              filter === key
                ? 'bg-[rgba(138,130,173,0.25)] text-base border-[rgba(138,130,173,0.35)]'
                : 'bg-transparent text-app-empty border-transparent hover:text-app-todo-text hover:bg-[rgba(138,130,173,0.1)]'
            }`}
            onClick={() => onFilterChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

TodoFilters.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
}

export function TodoList({ todos, onToggle, onRemove, onUpdate, onReorder }) {
  const { t } = useI18n()
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const filteredTodos = useMemo(() => {
    let result = todos
    if (filter === 'active') result = result.filter((t) => !t.completed)
    if (filter === 'completed') result = result.filter((t) => t.completed)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((t) => t.text.toLowerCase().includes(q))
    }
    return result
  }, [todos, filter, searchQuery])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id)
      const newIndex = todos.findIndex((t) => t.id === over.id)
      onReorder(oldIndex, newIndex)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <TodoFilters
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ul className="list-none overflow-y-auto px-3 pb-3 flex flex-col gap-2.5 flex-1 todo-list">
        {filteredTodos.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTodos.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <li className="mt-5 text-center text-app-empty text-xl list-none">{t('emptyTodos')}</li>
        )}
      </ul>
      <div className="flex items-center justify-between px-4 py-2 border-t border-app-header-divider text-xs text-app-empty">
        <span>{t('activeCount', { count: todos.filter((t) => !t.completed).length })}</span>
        <span>{t('completedCount', { count: todos.filter((t) => t.completed).length })}</span>
      </div>
    </div>
  )
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      priority: PropTypes.string,
      createdAt: PropTypes.number
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired
}
