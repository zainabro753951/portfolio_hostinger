import React, { memo } from "react";
import { motion } from "motion/react";
import { Settings, RotateCcw, Save, Loader2 } from "lucide-react";

const DSiteSettingsHeader = ({ handleReset, isPending }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6"
    >
      {/* Header Info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Site Settings
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage all your site settings
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Reset Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={handleReset}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 text-sm font-medium disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </motion.button>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 text-sm"
          type={isPending ? "button" : "submit"}
        >
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
