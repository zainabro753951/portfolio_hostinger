import React, { memo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { AlertTriangle, X, Trash2, Loader2 } from "lucide-react";
import { useDeleteEntryContext } from "../../../context/DeleteEntry";

const DeleteConfirm = () => {
  const { isOpen, onDelete, onClose, isPending, route, ids } =
    useDeleteEntryContext();
  const prefersReducedMotion = useReducedMotion();

  // Dynamic heading & text
  const getTitle = useCallback(() => {
    if (ids?.length > 1) return `Delete ${ids.length} Items?`;
    if (route?.includes("contact")) return "Delete Message?";
    if (route?.includes("project")) return "Delete Project?";
    if (route?.includes("blog")) return "Delete Blog Post?";
    return "Confirm Deletion";
  }, [ids, route]);

  const getMessage = useCallback(() => {
    if (ids?.length > 1) {
      return `Are you sure you want to delete ${ids.length} selected items? This action cannot be undone.`;
    }
    return "Are you sure you want to delete this item? This action cannot be undone.";
  }, [ids]);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const handleDelete = useCallback(() => {
    if (!isPending) onDelete();
  }, [isPending, onDelete]);

  const handleClose = useCallback(() => {
    if (!isPending) onClose();
  }, [isPending, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with icon */}
            <div className="flex flex-col items-center pt-8 pb-6 px-6 bg-gradient-to-b from-rose-500/10 to-transparent">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-4 border border-rose-500/30">
                <AlertTriangle className="w-8 h-8 text-rose-400" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
                {getTitle()}
              </h2>
            </div>

            {/* Message */}
            <div className="px-6 pb-6">
              <p className="text-slate-400 text-sm sm:text-base text-center leading-relaxed">
                {getMessage()}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 p-6 pt-0">
              <motion.button
                disabled={isPending}
                onClick={handleClose}
                whileHover={
                  !isPending && !prefersReducedMotion ? { scale: 1.02 } : {}
                }
                whileTap={!isPending ? { scale: 0.98 } : {}}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-slate-300 font-medium text-sm hover:bg-slate-700/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                Cancel
              </motion.button>

              <motion.button
                disabled={isPending}
                onClick={handleDelete}
                whileHover={
                  !isPending && !prefersReducedMotion ? { scale: 1.02 } : {}
                }
                whileTap={!isPending ? { scale: 0.98 } : {}}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </motion.button>
            </div>

            {/* Close button (top right) */}
            <button
              onClick={handleClose}
              disabled={isPending}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(DeleteConfirm);
