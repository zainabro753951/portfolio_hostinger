import React, { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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

const FileInputField = ({
  label,
  name,
  register,
  error,
  required = false,
  existingFileUrl = "",
  accept = "*/*",
  maxSize = 10, // MB
  onFileSelect,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get file icon based on type
  const getFileIcon = useCallback((fileName) => {
    if (!fileName) return File;
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
      return FileImage;
    }
    if (["js", "jsx", "ts", "tsx", "html", "css", "json"].includes(ext)) {
      return FileCode;
    }
    return File;
  }, []);

  // Handle file selection
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          return;
        }
        setSelectedFile(file);
        onFileSelect?.(file);
      }
    },
    [maxSize, onFileSelect],
  );

  // Clear selected file
  const handleClear = useCallback(() => {
    setSelectedFile(null);
    onFileSelect?.(null);
  }, [onFileSelect]);

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
      if (file) {
        if (file.size > maxSize * 1024 * 1024) {
          return;
        }
        setSelectedFile(file);
        onFileSelect?.(file);
      }
    },
    [maxSize, onFileSelect],
  );

  const FileIcon = getFileIcon(selectedFile?.name || existingFileUrl);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Label */}
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

        {/* Drop Zone */}
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
          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {selectedFile || existingFileUrl ? (
                // File Selected State
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4"
                >
                  {/* File Icon */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                    <FileIcon className="w-6 h-6" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {selectedFile?.name || "Existing file"}
                    </p>
                    {selectedFile && (
                      <p className="text-xs text-slate-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                    {existingFileUrl && !selectedFile && (
                      <motion.a
                        href={existingFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-1.5 mt-1 text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View current file
                      </motion.a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {selectedFile && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </motion.div>
                    )}
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                // Empty State
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

            {/* Hidden Input */}
            <input
              type="file"
              name={name}
              accept={accept}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              {...register(name, { required })}
              onChange={handleFileChange}
            />
          </div>
        </motion.div>
      </label>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-rose-400 flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {label} is required
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(FileInputField);
