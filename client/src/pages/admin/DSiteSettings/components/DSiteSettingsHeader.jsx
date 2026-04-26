import React, { memo } from "react";
import { motion } from "motion/react";
import { Settings, RotateCcw, Save, Loader2, CheckCircle2 } from "lucide-react";

const DSiteSettingsHeader = ({
  handleReset,
  isPending,
  isDirty,
  hasUnsavedChanges,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6"
    >
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: 90, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center text-violet-400 border border-violet-500/20 shadow-lg shadow-violet-500/10"
        >
          <Settings className="w-7 h-7" />
        </motion.div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Site Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            Manage all your site settings
            {hasUnsavedChanges && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Unsaved
              </motion.span>
            )}
            {!hasUnsavedChanges && isDirty && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20"
              >
                <CheckCircle2 className="w-3 h-3" />
                Saved
              </motion.span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Reset Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03, y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={handleReset}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/60 border border-white/10 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-white/20 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </motion.button>

        {/* Save Button - FIXED: Always type="submit" */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:from-violet-400 hover:to-blue-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 text-sm relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default memo(DSiteSettingsHeader);
