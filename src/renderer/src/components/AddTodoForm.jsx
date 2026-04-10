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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="w-full h-[50px] px-6 py-0 rounded-2xl border border-[rgba(227,228,242,0.9)] bg-[rgba(248,249,255,0.88)] text-[#655f7c] text-xl font-medium placeholder:text-[#a8a4bc] focus:outline-none focus:border-[rgba(138,130,173,0.8)] focus:shadow-[0_0_0_3px_rgba(180,174,210,0.2)]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Write here anythings"
      />
      <button
        type="submit"
        className="w-[220px] h-9 mx-auto border border-white/75 rounded-full bg-[rgba(240,241,252,0.88)] text-[#766f93] text-lg font-semibold cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_16px_rgba(86,72,132,0.12)]"
      >
        Add to list <span aria-hidden="true">&#9656;</span>
      </button>
    </form>
  )
}

AddTodoForm.propTypes = {
  onAdd: PropTypes.func.isRequired
}
