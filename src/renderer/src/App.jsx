import { useState, useEffect, useCallback, useRef } from 'react'
import { useTodos } from './hooks/useTodos'
import { TodoList } from './components/TodoList'
import { AddTodoForm } from './components/AddTodoForm'
import { UndoToast } from './components/UndoToast'
import { useI18n } from './contexts/I18nContext'
import './assets/styles/animations.css'

function App() {
  const { t } = useI18n()
  const { todos, addTodo, toggleTodo, removeTodo, updateTodo, reorderTodos, restoreTodo } =
    useTodos()
  const [snap, setSnap] = useState({ snapped: false, direction: null, isAnimating: false })
  const [showUndo, setShowUndo] = useState(false)
  const undoTodoRef = useRef(null)
  const undoTimerRef = useRef(null)

  useEffect(() => {
    window.api.onWindowSnap(({ snapped, direction }) => {
      setSnap({ snapped, direction, isAnimating: true })
      setTimeout(() => setSnap((prev) => ({ ...prev, isAnimating: false })), 500)
    })
  }, [])

  const handleRemove = useCallback(
    (todo) => {
      removeTodo(todo.id)
      undoTodoRef.current = todo
      setShowUndo(true)
      clearTimeout(undoTimerRef.current)
      undoTimerRef.current = setTimeout(() => {
        setShowUndo(false)
        undoTodoRef.current = null
      }, 5000)
    },
    [removeTodo]
  )

  const handleUndo = useCallback(() => {
    if (undoTodoRef.current) {
      restoreTodo(undoTodoRef.current)
      undoTodoRef.current = null
    }
    clearTimeout(undoTimerRef.current)
    setShowUndo(false)
  }, [restoreTodo])

  useEffect(() => {
    window.api.onWindowSnap(({ snapped, direction }) => {
      setSnap({ snapped, direction, isAnimating: true })
      setTimeout(() => setSnap((prev) => ({ ...prev, isAnimating: false })), 500)
    })
  }, [])

  const getAppClassName = () => {
    const baseClass =
      'flex flex-col w-screen h-screen min-w-[450px] min-h-[650px] rounded-[25px] border border-app-shell-border'
    if (!snap.direction) return baseClass
    if (snap.snapped) return `${baseClass} snapped-${snap.direction}`
    if (snap.isAnimating) return `${baseClass} un-snapping-${snap.direction}`
    return baseClass
  }

  return (
    <div className={getAppClassName()}>
      <div className="relative w-full h-full p-5 rounded-3xl bg-app-panel backdrop-blur-[2px] border border-app-panel-border app-panel-shadow app-overlay overflow-hidden">
        <div className="flex absolute top-0 left-0 w-full h-7 [-webkit-app-region:drag]" />
        <div className="relative flex flex-col gap-3.5 w-full h-full">
          <section className="rounded-2xl border border-app-section-border app-card-shadow backdrop-blur-xs p-4 [-webkit-app-region:no-drag]">
            <AddTodoForm onAdd={addTodo} />
          </section>
          <section className="rounded-2xl border border-app-section-border app-card-shadow backdrop-blur-xs flex flex-col overflow-hidden [-webkit-app-region:no-drag] h-[calc(100%-100px)]">
            <header className="flex items-center justify-center gap-2 py-2.5 w-[calc(100%-30px)] mx-auto mb-2.5 border-b border-app-header-divider">
              <span className="text-[25px] font-bold tracking-[0.3px] text-app-title">
                {t('appTitle')}
              </span>
            </header>
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onRemove={handleRemove}
              onUpdate={updateTodo}
              onReorder={reorderTodos}
            />
          </section>
        </div>
        <UndoToast show={showUndo} onUndo={handleUndo} />
      </div>
    </div>
  )
}

export default App
