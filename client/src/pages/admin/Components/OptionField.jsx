import React, { memo } from "react";
import { motion } from "motion/react";
import { ChevronDown, AlertCircle } from "lucide-react";

// Field base classes - converted from template literal to object
const fieldClasses = {
  base: "w-full bg-slate-800/50 border border-white/10 rounded-xl outline-none text-white backdrop-blur-sm px-4 py-3 transition-all duration-200 appearance-none",
  focus: "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
  hover: "hover:border-white/20 hover:bg-slate-800/70",
  disabled: "opacity-50 cursor-not-allowed",
  error: "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20",
};

const SelectField = ({
  label,
  name,
  register,
  errors = {},
  required = true,
  defaultValue = "",
  options = [],
  placeholder = "-- Select an option --",
  disabled = false,
  className = "",
}) => {
  const hasError = errors[name];

  const rules = required ? { required: `${label || name} is required` } : {};

  const selectClasses = `
    ${fieldClasses.base}
    ${fieldClasses.focus}
    ${fieldClasses.hover}
    ${disabled ? fieldClasses.disabled : ""}
    ${hasError ? fieldClasses.error : ""}
    ${className}
  `.trim();

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
          {label}
          {required && <span className="text-rose-400">*</span>}
        </span>
      )}

      <div className="relative">
        <select
          {...register(name, rules)}
          defaultValue={defaultValue || ""}
          disabled={disabled}
          className={selectClasses}
          aria-label={label || name}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${name}-error` : undefined}
        >
          <option value="" className="bg-slate-900 text-slate-400">
            {placeholder}
          </option>

          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-slate-900 text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron icon */}
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
      </div>

      {hasError && (
        <motion.span
          id={`${name}-error`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-400 flex items-center gap-1.5"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {errors[name]?.message || `${label || name} is required`}
        </motion.span>
      )}
    </div>
  );
};

export default memo(SelectField);
