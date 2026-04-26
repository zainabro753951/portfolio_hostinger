// FileInputField.jsx - Updated
import React, { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFormContext } from "react-hook-form"; // 👈 Add this
import {
  FileText,
  AlertCircle,
  ExternalLink,
  Upload,
  X,
  FileImage,
  FileCode,
  File,
  CheckCircle2,
} from "lucide-react";
import { getFileIcon, getFileNameFromUrl } from "../../../Utils/Utils";

const FileInputField = ({
  label,
  name,
  error,
  required = false,
  existingFileUrl = "",
  accept = "*/*",
  maxSize = 10, // MB
  onFileSelect,
}) => {
  const { setValue, watch, register } = useFormContext(); // 👈 Get from context
  const [isDragging, setIsDragging] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  // 👈 Watch the actual value from RHF
  const currentValue = watch(name);
  // ✅ Alternative - Check by file properties
  const selectedFile =
    currentValue &&
    currentValue.name &&
    currentValue.size &&
    currentValue.type !== undefined
      ? currentValue
      : null;

  // Handle file selection
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size should be less than ${maxSize}MB`);
        return;
      }

      // ✅ Set directly in RHF
      setValue(name, file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      onFileSelect?.(file);
    },
    [maxSize, onFileSelect, setValue, name],
  );

  // Clear selected file
  const handleClear = useCallback(() => {
    setValue(name, null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    onFileSelect?.(null);
  }, [onFileSelect, setValue, name]);

  // Drag & drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size should be less than ${maxSize}MB`);
        return;
      }

      setValue(name, file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      onFileSelect?.(file);
    },
    [maxSize, onFileSelect, setValue, name],
  );

  // Register for validation only (no ref needed)
  const { ref: registerRef, ...registerProps } = register(name, {
    required: required ? `${label} is required` : false,
  });

  const fileName = selectedFile?.name || getFileNameFromUrl(existingFileUrl);
  const { Icon: FileIcon, color: FileIconColor } = getFileIcon(fileName);
  const hasFile = selectedFile || existingFileUrl;

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          {label}
          {required && <span className="text-rose-400">*</span>}
          {maxSize && (
            <span className="text-xs text-slate-500 font-normal">
              (Max {maxSize}MB)
            </span>
          )}
        </span>

        {/* Drop Zone - relative with pointer-events-none on parent */}
        <motion.div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            scale: isDragging ? 1.02 : 1,
            borderColor: isDragging
              ? "rgba(34, 211, 238, 0.5)"
              : "rgba(255, 255, 255, 0.1)",
          }}
          className={`
            relative rounded-xl border-2 border-dashed 
            ${isDragging ? "bg-cyan-500/10" : "bg-slate-800/50"} 
            ${error ? "border-rose-500/30" : "border-white/10"}
            hover:border-cyan-400/30 transition-all duration-300
          `}
        >
          {/* 👇 INPUT LAYER - Lower z-index, only covers empty area */}
          <input
            type="file"
            name={name}
            accept={accept}
            {...registerProps}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
            onChange={handleFileChange}
          />

          <div className="relative z-10 p-4 sm:p-6 pointer-events-none">
            {" "}
            {/* 👈 pointer-events-none */}
            <AnimatePresence mode="wait">
              {hasFile ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4 pointer-events-auto" // 👈 Re-enable clicks here
                >
                  {/* File Icon */}
                  <div
                    className="w-12 h-12 rounded-lg  flex items-center justify-center  border  flex-shrink-0"
                    style={{
                      backgroundColor: FileIconColor + "20",
                      borderColor: FileIconColor,
                    }}
                  >
                    <FileIcon
                      className="w-6 h-6 stroke-current"
                      style={{
                        color: FileIconColor,
                      }}
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {selectedFile?.name ||
                        getFileNameFromUrl(existingFileUrl)}
                    </p>
                    {selectedFile && (
                      <p className="text-xs text-slate-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}

                    {/* 👇 LINK - Now clickable with higher z-index */}
                    {existingFileUrl && !selectedFile && (
                      <motion.a
                        href={`${backendUrl}${existingFileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => e.stopPropagation()} // 👈 Prevent input trigger
                        className="inline-flex items-center gap-1.5 mt-1 text-xs text-cyan-400 hover:text-cyan-300 relative z-20 pointer-events-auto"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View current file
                      </motion.a>
                    )}
                  </div>

                  {/* 👇 ACTIONS - Now clickable */}
                  <div className="flex items-center gap-2 pointer-events-auto">
                    {" "}
                    {/* 👈 Re-enable clicks */}
                    {selectedFile && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </motion.div>
                    )}
                    {/* 👇 CLEAR BUTTON - Stop propagation */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // 👈 Prevent input trigger
                        handleClear();
                      }}
                      className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors relative z-20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                // Empty State - No pointer-events-auto needed here
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center text-cyan-400/50 mb-3">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium">
                    Drop file here or click to upload
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports: {accept === "*/*" ? "All files" : accept}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </label>

      {/* Error Message - same as before */}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-rose-400 flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error.message || `${label} is required`}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(FileInputField);
