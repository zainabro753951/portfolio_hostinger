import React, { useEffect, useRef, useCallback, memo } from "react";

const EmailEditor = ({ initialValue, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const isTyping = useRef(false);
  const lastValue = useRef(initialValue);

  // Initialize content only once
  useEffect(() => {
    if (editorRef.current && !isTyping.current) {
      // Only set if different to avoid cursor reset
      if (editorRef.current.innerHTML !== initialValue) {
        editorRef.current.innerHTML = initialValue;
        lastValue.current = initialValue;
      }
    }
  }, [initialValue]);

  // Handle input with cursor preservation
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;

    isTyping.current = true;
    const newValue = editorRef.current.innerHTML;

    // Only call onChange if value actually changed
    if (newValue !== lastValue.current) {
      lastValue.current = newValue;
      onChange(newValue);
    }

    // Reset typing flag after a short delay
    setTimeout(() => {
      isTyping.current = false;
    }, 100);
  }, [onChange]);

  // Handle paste to strip formatting
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }, []);

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onPaste={handlePaste}
      className="
        min-h-[200px] w-full 
        px-4 py-3 
        rounded-xl 
        bg-slate-800/50 
        border border-white/10 
        text-white text-sm sm:text-base
        focus:border-cyan-500/50 
        focus:ring-2 focus:ring-cyan-500/20
        focus:outline-none
        transition-all duration-200
        empty:before:content-[attr(data-placeholder)] 
        empty:before:text-slate-500
        hover:border-white/20
      "
      data-placeholder={placeholder}
      style={{ whiteSpace: "pre-wrap" }}
    />
  );
};

export default memo(EmailEditor);
