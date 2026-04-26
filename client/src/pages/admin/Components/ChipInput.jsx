import React, { memo, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Plus, X } from "lucide-react";

// ── Field base classes ───────────────────────────────────────────
const fieldClasses = {
  base: "w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all duration-300",
  focus: "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
  hover: "hover:border-white/20 hover:bg-slate-800/70",
};

const fieldBase = `${fieldClasses.base} ${fieldClasses.focus} ${fieldClasses.hover}`;

// ── ChipInput Component ──────────────────────────────────────────
const ChipInput = ({
  fields = [],
  append,
  remove,
  inputId,
  placeholder = "Add item...",
  onAdd,
  error,
  icon: Icon,
  label,
  maxItems = 20,
}) => {
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState("");

  // ── Add chip handler ───────────────────────────────────────────
  const handleAdd = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    const value = input.value.trim();

    // Clear previous errors
    setLocalError("");

    if (!value) {
      setLocalError(`${label || "Item"} cannot be empty`);
      return;
    }

    // Call parent's onAdd with value and input ref for clearing
    if (onAdd) {
      onAdd(value, input);
    } else if (append) {
      // Fallback: direct append
      append({ name: value });
      input.value = "";
      input.focus();
    }
  }, [onAdd, append, label]);

  // ── Handle Enter key ───────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAdd();
      }
    },
    [handleAdd],
  );

  // ── Display error (parent error takes priority) ────────────────
  const displayError = error?.message || localError;

  return (
    <div className="space-y-3 w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="flex items-center gap-2 text-[13px] font-medium text-slate-300 select-none"
        >
          {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400/70" />}
          <span>{label}</span>
          <span className="text-xs text-slate-500 ml-auto">
            {fields.length}/{maxItems}
          </span>
        </label>
      )}

      {/* Input + Add Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className={fieldBase}
            aria-label={`Add ${label || "item"}`}
            aria-invalid={displayError ? "true" : "false"}
            aria-describedby={displayError ? `${inputId}-error` : undefined}
            disabled={fields.length >= maxItems}
          />
          {/* Focus indicator line */}
          <motion.div
            className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        <motion.button
          whileHover={fields.length >= maxItems ? {} : { scale: 1.03 }}
          whileTap={fields.length >= maxItems ? {} : { scale: 0.97 }}
          onClick={handleAdd}
          type="button"
          disabled={fields.length >= maxItems}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add
        </motion.button>
      </div>

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {displayError && (
          <motion.p
            id={`${inputId}-error`}
            key={`error-${inputId}`}
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-rose-400 text-xs flex items-center gap-1.5 overflow-hidden"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        <AnimatePresence mode="popLayout">
          {fields.map((field, idx) => (
            <motion.span
              key={field.id || `chip-${idx}-${field.name}`}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
            >
              {field.name || field.value}
              <button
                onClick={() => remove(idx)}
                type="button"
                className="text-cyan-400/50 hover:text-rose-400 transition-colors p-0.5 rounded-full hover:bg-white/5"
                aria-label={`Remove ${field.name || field.value}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        {fields.length === 0 && (
          <span className="text-xs text-slate-600 italic py-1">
            No items added yet
          </span>
        )}
      </div>
    </div>
  );
};

ChipInput.displayName = "ChipInput";
export default memo(ChipInput);
