import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'

const CustomSelect = ({ options, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block text-cyan-300 xs:w-full md:w-fit ">
      {/* Selected button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between xs:w-full md:w-fit md:gap-[4vw] sm:gap-[6vw] xs:gap-[8vw] md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw]
          md:px-[1vw] sm:px-[2vw] xs:px-[3vw]
          bg-gradient-to-r from-cyan-500/30 to-blue-500/20
          border border-cyan-400  shadow-[0_0_15px_rgba(34,211,238,0.25)]
          md:text-[1vw] sm:text-[2vw] xs:text-[4vw] rounded-full outline-none backdrop-blur-md shrink-0"
      >
        <span>{selected}</span>
        <FaChevronDown
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 md:mt-[0.5vw] sm:mt-[1vw] xs:mt-[1.5vw] xs:w-full  md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw] overflow-hidden
              border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]
              backdrop-blur-md bg-gradient-to-r from-cyan-500/40 to-blue-500/30 z-50"
          >
            {options.map((opt, i) => (
              <li
                key={i}
                onClick={() => {
                  setSelected(opt)
                  setIsOpen(false)
                }}
                className="cursor-pointer md:px-[1vw] sm:px-[2vw] xs:px-[3vw] md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] hover:bg-cyan-500/40 transition-colors duration-200 md:text-[1vw] sm:text-[2vw] xs:text-[4vw]"
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomSelect
