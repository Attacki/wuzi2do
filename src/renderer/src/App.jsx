import { useState, useEffect } from 'react'
import { useTodos } from './hooks/useTodos'
import { TodoList } from './components/TodoList'
import { AddTodoForm } from './components/AddTodoForm'
import './assets/animations.css'

function App() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos()
  const [snap, setSnap] = useState({ snapped: false, direction: null, isAnimating: false })

  useEffect(() => {
    window.api.onWindowSnap(({ snapped, direction }) => {
      setSnap({ snapped, direction, isAnimating: true })
      setTimeout(() => setSnap((prev) => ({ ...prev, isAnimating: false })), 500)
    })
  }, [])

  const getAppClassName = () => {
    const baseClass =
      'flex flex-col w-screen h-screen min-w-[450px] min-h-[650px] rounded-[25px] border border-white/75'
    if (!snap.direction) return baseClass
    if (snap.snapped) return `${baseClass} snapped-${snap.direction}`
    if (snap.isAnimating) return `${baseClass} un-snapping-${snap.direction}`
    return baseClass
  }

  return (
    <div className={getAppClassName()}>
      <div className="w-full h-full p-5 rounded-3xl bg-[#ffffff] backdrop-blur-[2px] border border-[#737373] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] app-overlay overflow-hidden">
        <div className="flex absolute top-0 left-0 w-full h-7 [-webkit-app-region:drag]" />
        <div className="relative flex flex-col gap-3.5 w-full h-full">
          <section className="rounded-2xl  border border-[#939393] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_30px_rgba(73,62,121,0.12)] backdrop-blur-[4px] p-4 [-webkit-app-region:no-drag]">
            <AddTodoForm onAdd={addTodo} />
          </section>
          <section className="rounded-2xl  border border-[#939393] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_30px_rgba(73,62,121,0.12)] backdrop-blur-[4px] flex flex-col overflow-hidden [-webkit-app-region:no-drag] h-[calc(100%-100px)]">
            <header className="flex items-center justify-center gap-2 py-2.5 w-[calc(100%-30px)] mx-auto mb-2.5 border-b border-[rgba(150,142,182,0.24)]">
              <span className="text-[25px] font-bold tracking-[0.3px] text-[#1c1c1c]">
                吾之所向
              </span>
            </header>
            <TodoList todos={todos} onToggle={toggleTodo} onRemove={removeTodo} />
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
