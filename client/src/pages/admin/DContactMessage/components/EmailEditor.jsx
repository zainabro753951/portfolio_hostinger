import React, { useEffect, useRef, useCallback } from "react";

const EmailEditor = ({ initialValue, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const isTyping = useRef(false);
  const lastValue = useRef(initialValue);

  // ✅ Initialize content only once
  useEffect(() => {
    if (editorRef.current && !isTyping.current) {
      // Only set if different to avoid cursor reset
      if (editorRef.current.innerHTML !== initialValue) {
        editorRef.current.innerHTML = initialValue;
        lastValue.current = initialValue;
      }
    }
  }, [initialValue]);

  // ✅ Handle input with cursor preservation
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

  // ✅ Handle paste to strip formatting
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
      className="min-h-[200px] w-full px-4 py-3 rounded-xl bg-white/5 border border-cyan-400/20 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500"
      data-placeholder={placeholder}
      style={{ whiteSpace: "pre-wrap" }}
    />
  );
};

export default EmailEditor;
