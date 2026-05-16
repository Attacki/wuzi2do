import { useState, useEffect, useCallback } from 'react'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

function sortByPriority(todos) {
  return [...todos].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
}

export function useTodos() {
  const [todos, setTodos] = useState(() => {
    try {
      const storedTodos = localStorage.getItem('todos')
      return storedTodos ? JSON.parse(storedTodos) : []
    } catch (error) {
      console.error('Failed to parse todos from localStorage', error)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos))
    } catch (error) {
      console.error('Failed to save todos to localStorage', error)
    }
  }, [todos])

  const addTodo = useCallback((text, priority = 'medium') => {
    if (text.trim()) {
      setTodos((prev) =>
        sortByPriority([
          ...prev,
          { id: Date.now(), text, completed: false, priority, createdAt: Date.now() }
        ])
      )
    }
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    )
  }, [])

  const removeTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const updateTodo = useCallback((id, updates) => {
    setTodos((prev) =>
      sortByPriority(prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
    )
  }, [])

  const reorderTodos = useCallback((fromIndex, toIndex) => {
    setTodos((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  return { todos, addTodo, toggleTodo, removeTodo, updateTodo, reorderTodos }
}
