// File: components/FileInputField.jsx

import React from 'react'

const FileInputField = ({
  label,
  name,
  register,
  error,
  required = false,
  existingFileUrl = '',
  fieldBase = '',
}) => {
  return (
    <div className="w-full flex flex-col gap-0.5">
      <label className="flex flex-col">
        <span className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] text-gray-300 mb-[0.5vw]">
          {label}
        </span>

        <div className="relative">
          <input
            type="file"
            name={name}
            className={`${fieldBase} cursor-pointer`}
            {...register(name, { required })}
          />

          {/* If there's an existing file (backend URL), show it */}
          {existingFileUrl && (
            <a
              href={existingFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 md:text-[1vw] sm:text-[2vw] xs:text-[3vw] "
            >
              View current
            </a>
          )}
        </div>
      </label>

      {error && (
        <span className="md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw] text-red-400 mt-[0.3vw]">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default FileInputField
