import React, { memo } from "react";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";

// Field base classes - converted from template literal to object
const fieldClasses = {
  base: "w-full bg-slate-800/50 border border-white/10 rounded-xl outline-none text-white placeholder:text-slate-500 backdrop-blur-sm px-4 py-3 transition-all duration-200",
  focus:
    "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-lg focus:shadow-cyan-500/10",
  hover: "hover:border-white/20 hover:bg-slate-800/70",
  disabled: "opacity-50 cursor-not-allowed",
  error: "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20",
};

const FormField = ({
  label,
  name,
  type = "text",
  register,
  errors = {},
  placeholder = "",
  required = true,
  validation = {},
  disabled = false,
  className = "",
}) => {
  const hasError = errors[name];

  const rules = {
    ...(required && { required: `${label || name} is required` }),
    ...(name === "email" && {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
    }),
    ...validation,
  };

  const inputClasses = `
    ${fieldClasses.base}
    ${fieldClasses.focus}
    ${fieldClasses.hover}
    ${disabled ? fieldClasses.disabled : ""}
    ${hasError ? fieldClasses.error : ""}
    ${className}
  `.trim();

  return (
    <label className="flex flex-col w-full gap-2">
      {label && (
        <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
          {label}
          {required && <span className="text-rose-400">*</span>}
        </span>
      )}

      <input
        type={type}
        {...register(name, rules)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        aria-label={label || name}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />

      {hasError && (
        <motion.span
          id={`${name}-error`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-400 flex items-center gap-1.5"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {errors[name].message || `${label || name} is required`}
        </motion.span>
      )}
    </label>
  );
};

export default memo(FormField);
