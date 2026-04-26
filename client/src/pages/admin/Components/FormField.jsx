import React, { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle } from "lucide-react";

// ── Field base classes ───────────────────────────────────────────
const fieldClasses = {
  base: "w-full bg-slate-800/50 border border-white/10 rounded-xl outline-none text-white placeholder:text-slate-500 backdrop-blur-sm px-4 py-3.5 transition-all duration-300 ease-out",
  focus:
    "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-[0_0_20px_rgba(6,182,212,0.08)]",
  hover:
    "hover:border-white/20 hover:bg-slate-800/70 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)]",
  disabled: "opacity-50 cursor-not-allowed bg-white/[0.03]",
  error:
    "border-rose-500/50 focus:border-rose-500/60 focus:ring-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.08)]",
  success:
    "border-emerald-500/40 focus:border-emerald-500/50 focus:ring-emerald-500/15",
};

// ── Label component ──────────────────────────────────────────────
const FieldLabel = memo(({ label, required, icon: Icon }) => (
  <span className="text-[13px] font-medium text-slate-300 flex items-center gap-2 select-none">
    {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400/70" />}
    {label}
    {required && (
      <span className="text-rose-400 text-xs" aria-hidden="true">
        *
      </span>
    )}
  </span>
));

// ── Error message component ──────────────────────────────────────
const ErrorMessage = memo(({ message, fieldId }) => (
  <motion.div
    id={`${fieldId}-error`}
    initial={{ opacity: 0, y: -6, height: 0 }}
    animate={{ opacity: 1, y: 0, height: "auto" }}
    exit={{ opacity: 0, y: -6, height: 0 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="overflow-hidden"
    role="alert"
  >
    <span className="text-xs text-rose-400 flex items-center gap-1.5 pt-1.5">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
      <span className="leading-relaxed">{message}</span>
    </span>
  </motion.div>
));

// ── Main FormField Component ─────────────────────────────────────
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
  autocomplete = "on",
  icon: Icon,
  onBlur,
  onChange,
  value, // ✅ ADDED: Support controlled value
  defaultValue, // ✅ ADDED: Support default value
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // ── DEBUG: Log to see what's happening ─────────────────────────
  // console.log(`FormField [${name}]:`, { errors: errors?.[name], hasValue: !!value });

  // ── Properly check for errors ──────────────────────────────────
  const errorObj = errors?.[name];
  const hasError = Boolean(errorObj);
  const errorMessage =
    errorObj?.message || (required ? `${label || name} is required` : "");

  // ── Build validation rules ─────────────────────────────────────
  const rules = {
    ...(required && {
      required: `${label || name} is required`,
    }),
    ...(name === "email" && {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
    }),
    ...(type === "password" && {
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    }),
    ...validation,
  };

  // ── Handlers ───────────────────────────────────────────────────
  const handleFocus = useCallback(() => setIsFocused(true), []);

  const handleBlur = useCallback(
    (e) => {
      setIsFocused(false);
      setIsTouched(true);
      onBlur?.(e);
    },
    [onBlur],
  );

  const handleChange = useCallback(
    (e) => {
      onChange?.(e);
    },
    [onChange],
  );

  // ── Dynamic classes ────────────────────────────────────────────
  const inputClasses = [
    fieldClasses.base,
    fieldClasses.focus,
    !disabled && fieldClasses.hover,
    disabled && fieldClasses.disabled,
    hasError && fieldClasses.error,
    !hasError && isTouched && !errorObj && fieldClasses.success,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ── ✅ CRITICAL FIX: Proper register spread ────────────────────
  // register returns: { name, onChange, onBlur, ref }
  // We need to merge these properly without overwriting
  const registerProps = register(name, rules);

  return (
    <div className="flex flex-col w-full gap-1.5">
      {/* Label */}
      {label && (
        <label htmlFor={name} className="cursor-pointer">
          <FieldLabel label={label} required={required} icon={Icon} />
        </label>
      )}

      {/* Input wrapper with icon support */}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="w-4 h-4 text-slate-500" />
          </div>
        )}

        <input
          id={name}
          type={type}
          // ✅ FIXED: Spread register FIRST, then override with our handlers
          {...registerProps}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autocomplete}
          className={[inputClasses, Icon && "pl-11"].filter(Boolean).join(" ")}
          aria-label={label || name}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${name}-error` : undefined}
          // ✅ FIXED: Merge register's handlers with our custom ones
          onFocus={(e) => {
            setIsFocused(true);
            registerProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            handleBlur(e);
            registerProps.onBlur(e);
          }}
          onChange={(e) => {
            handleChange(e);
            registerProps.onChange(e);
          }}
          // ✅ Support controlled/uncontrolled modes
          value={value}
          defaultValue={defaultValue}
          {...rest}
        />

        {/* Focus indicator line - blue/cyan gradient */}
        <motion.div
          className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: isFocused && !hasError ? 1 : 0,
            opacity: isFocused && !hasError ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Error Message with AnimatePresence */}
      <AnimatePresence mode="wait">
        {hasError && (
          <ErrorMessage
            message={errorMessage}
            fieldId={name}
            key={`error-${name}`}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Display name for debugging ───────────────────────────────────
FormField.displayName = "FormField";

export default memo(FormField);
