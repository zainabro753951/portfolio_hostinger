import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronDown, Check } from "lucide-react";

const CustomSelect = ({ options, selected, setSelected, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (opt) => {
      setSelected(opt);
      setIsOpen(false);
    },
    [setSelected],
  );

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -8,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <div
      ref={selectRef}
      className={`relative inline-block w-full sm:w-auto ${className}`}
    >
      {/* Selected button */}
      <motion.button
        type="button"
        onClick={toggleOpen}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-between w-full sm:w-auto min-w-[160px] gap-4 px-4 py-2.5 
          bg-slate-800/50 border border-white/10 hover:border-cyan-500/30
          rounded-xl text-slate-200 text-sm font-medium
          backdrop-blur-md transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      >
        <span className="truncate">{selected}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            variants={dropdownVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute left-0 right-0 sm:right-auto mt-2 min-w-full 
              rounded-xl overflow-hidden border border-white/10 shadow-2xl
              backdrop-blur-xl bg-slate-900/95 z-50 py-1"
          >
            {options.map((opt, i) => {
              const isSelected = opt === selected;
              return (
                <motion.li
                  key={opt}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => handleSelect(opt)}
                  className={`cursor-pointer px-4 py-2.5 text-sm flex items-center justify-between gap-3
                    transition-colors duration-150
                    ${
                      isSelected
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(CustomSelect);
