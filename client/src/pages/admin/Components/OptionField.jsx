// src/components/SelectField.jsx
import React from 'react'

const fieldBase = `
  w-full bg-gradient-to-r from-white/5 to-white/10
  border border-cyan-400/20 focus:border-cyan-300/60
  md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw]
  outline-none text-white placeholder:text-gray-400
  backdrop-blur-xl md:px-[1vw] sm:px-[2vw] xs:px-[3vw]
  md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw]
  transition-all duration-200 ease-in-out
  focus:ring-2 focus:ring-cyan-400/30 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)]
  md:text-[1vw] sm:text-[2vw] xs:text-[3vw]
`

const SelectField = ({
  label,
  name,
  register,
  errors = {},
  required = true,
  defaultValue = '',
  options = [],
  placeholder = '-- Select an option --',
  disabled = false,
}) => {
  const rules = required ? { required: `${label || name} is required` } : {}

  return (
    <div className="w-full flex flex-col gap-[0.5vw]">
      {label && (
        <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300">{label}</span>
      )}

      <select
        {...register(name, rules)}
        defaultValue={defaultValue || ''}
        disabled={disabled}
        className={`${fieldBase} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={label || name}
      >
        <option value="" className="bg-black">
          {placeholder}
        </option>

        {options.map((opt, i) => (
          <option key={i} value={opt.value} className="bg-black">
            {opt.label}
          </option>
        ))}
      </select>

      {errors[name] && (
        <span className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-red-500">
          {errors[name]?.message || `${label || name} is required`}
        </span>
      )}
    </div>
  )
}

export default SelectField
