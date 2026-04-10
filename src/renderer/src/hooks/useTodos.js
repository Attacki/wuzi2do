import { useState, useEffect } from 'react'

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

  const addTodo = (text) => {
    if (text.trim()) {
      setTodos([...todos, { id: Date.now(), text, completed: false }])
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return { todos, addTodo, toggleTodo, removeTodo }
}
