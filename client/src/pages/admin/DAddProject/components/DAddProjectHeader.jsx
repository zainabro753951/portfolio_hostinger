import React, { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FilePlus, Loader2 } from "lucide-react";

const DAddProjectHeader = ({ isPending }) => {
  const prefersReducedMotion = useReducedMotion();

  const fadeInVariants = {
    hidden: { y: -20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const buttonHoverAnimation = prefersReducedMotion ? {} : { scale: 1.02 };

  return (
    <motion.header
      variants={fadeInVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8"
    >
      {/* Title Section */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
          <FilePlus className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Add / Edit Project
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Create or update project details, SEO and assets.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={buttonHoverAnimation}
        whileTap={{ scale: 0.98 }}
        disabled={isPending}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 sm:w-auto w-full"
        title={isPending ? "Publishing..." : "Publish Project"}
        type={isPending ? "button" : "submit"}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Publishing...</span>
          </>
        ) : (
          <>
            <span>Publish Project</span>
          </>
        )}
      </motion.button>
    </motion.header>
  );
};

export default memo(DAddProjectHeader);
