import { useState } from 'react'
import PropTypes from 'prop-types'

export function AddTodoForm({ onAdd }) {
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
        className="w-full h-[50px] px-6 py-0 rounded-md border border-[rgba(227,228,242,0.9)] bg-[rgba(248,249,255,0.88)] text-[#655f7c] text-xl font-medium placeholder:text-[#a8a4bc] focus:outline-none focus:border-[rgba(138,130,173,0.8)] focus:shadow-[0_0_0_3px_rgba(180,174,210,0.2)]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Write here anythings"
      />
      <button
        type="submit"
        className="min-w-[50px] h-[50px] border rounded-md border-white/75 bg-[rgba(240,241,252,0.88)] text-[#766f93] text-md font-semibold cursor-pointer transition-transform duration-200 hover:bg-[#fafbff] hover:shadow-[0_2px_16px_rgba(86,72,132,0.12)]"
      >
        Add
      </button>
    </form>
  )
}

AddTodoForm.propTypes = {
  onAdd: PropTypes.func.isRequired
}
