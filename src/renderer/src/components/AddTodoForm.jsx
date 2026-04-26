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
        className="w-full h-[50px] px-6 py-0 rounded-md border border-[rgba(227,228,242,0.9)] bg-[rgba(255,255,255,0.88)] text-[#313131] text-md font-medium placeholder:text-[#bebebe] focus:outline-none focus:border-[rgba(138,130,173,0.8)] focus:shadow-[0_0_0_3px_rgba(180,174,210,0.2)]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="渐入"
      />
      <button
        type="submit"
        className="min-w-[50px] h-[50px] border rounded-md border-[rgba(227,228,242,0.9)] bg-[rgba(255,255,255,0.88)] text-[#313131] text-xl font-semibold cursor-pointer transition-transform duration-200 hover:bg-[#fafbff] hover:shadow-[0_2px_16px_rgba(86,72,132,0.12)]"
      >
        曰
      </button>
    </form>
  )
}

AddTodoForm.propTypes = {
  onAdd: PropTypes.func.isRequired
}
