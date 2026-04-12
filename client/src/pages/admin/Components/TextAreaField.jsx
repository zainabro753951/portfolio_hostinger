import React, { memo } from "react";
import { motion } from "motion/react";
import { FileText, AlertCircle } from "lucide-react";

// Field base classes - converted from template literal to object
const fieldClasses = {
  base: "w-full bg-slate-800/50 border border-white/10 rounded-xl outline-none text-white placeholder:text-slate-500 backdrop-blur-sm px-4 py-3 transition-all duration-200 resize-none",
  focus:
    "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-lg focus:shadow-cyan-500/10",
  hover: "hover:border-white/20 hover:bg-slate-800/70",
  disabled: "opacity-50 cursor-not-allowed",
  error: "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20",
};

const TextareaField = ({
  label,
  name,
  register,
  errors = {},
  placeholder = "",
  required = true,
  defaultValue = "",
  rows = 5,
  disabled = false,
  className = "",
  maxLength,
  showCount = false,
}) => {
  const hasError = errors[name];
  const [charCount, setCharCount] = React.useState(defaultValue?.length || 0);

  const rules = {
    ...(required && { required: `${label || name} is required` }),
    ...(maxLength && {
      maxLength: {
        value: maxLength,
        message: `${label || name} must be at most ${maxLength} characters`,
      },
    }),
  };

  const textareaClasses = `
    ${fieldClasses.base}
    ${fieldClasses.focus}
    ${fieldClasses.hover}
    ${disabled ? fieldClasses.disabled : ""}
    ${hasError ? fieldClasses.error : ""}
    ${className}
  `.trim();

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            {label}
            {required && <span className="text-rose-400">*</span>}
          </span>
          {showCount && maxLength && (
            <span
              className={`text-xs ${charCount > maxLength ? "text-rose-400" : "text-slate-500"}`}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        rows={rows}
        {...register(name, rules)}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        maxLength={maxLength}
        onChange={handleChange}
        className={textareaClasses}
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
          {errors[name]?.message || `${label || name} is required`}
        </motion.span>
      )}
    </div>
  );
};

export default memo(TextareaField);
