import React from 'react'

const fieldBase = `
  w-full bg-gradient-to-r from-white/5 to-white/10
  border border-cyan-400/20
  focus:border-cyan-300/60
  md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw]
  outline-none text-white placeholder:text-gray-400
  backdrop-blur-xl md:px-[1vw] sm:px-[2vw] xs:px-[3vw]
  md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw]
  transition-all duration-200 ease-in-out
  focus:ring-2 focus:ring-cyan-400/30
  focus:shadow-[0_0_10px_rgba(34,211,238,0.2)]
  md:placeholder:text-[1vw] sm:placeholder:text-[2vw] xs:placeholder:text-[4vw]
  md:text-[1vw] sm:text-[2vw] xs:text-[3vw]
`

const FormField = ({
  label,
  name,
  type = 'text',
  register,
  errors = {},
  placeholder = '',
  required = true,
  validation = {},
  disabled = false,
}) => {
  const rules = {
    ...(required && { required: `${label || name} is required` }),
    ...(name === 'email' && {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    }),
    ...validation,
  }

  return (
    <label className="flex flex-col w-full">
      {label && (
        <span className="md:text-[1vw] sm:text-[2vw] xs:text-[4vw] text-gray-300 mb-[0.5vw]">
          {label}
        </span>
      )}
      <input
        type={type}
        {...register(name, rules)} // ✅ RHF controls value automatically
        placeholder={placeholder}
        disabled={disabled}
        className={`${fieldBase}
          focus:shadow-[0_0_12px_rgba(34,211,238,0.25)]
          hover:border-cyan-400/40
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label={label || name}
      />

      {errors[name] && (
        <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
          {errors[name].message || `${label || name} is required`}
        </span>
      )}
    </label>
  )
}

export default FormField
