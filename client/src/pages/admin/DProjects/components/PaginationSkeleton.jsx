import React, { memo } from "react";
import { motion } from "motion/react";

// Shimmer effect component
const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
);

// Individual page button skeleton
const PageButtonSkeleton = memo(({ index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.4,
      delay: index * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    className="relative overflow-hidden"
  >
    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-700/40 border border-white/10 flex items-center justify-center">
      <Shimmer />
    </div>
  </motion.div>
));

PageButtonSkeleton.displayName = "PageButtonSkeleton";

const PaginationSkeleton = () => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {/* Previous button skeleton */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden"
      >
        <div className="w-10 h-10 rounded-lg bg-slate-700/30 border border-white/10 flex items-center justify-center">
          <Shimmer />
        </div>
      </motion.div>

      {/* Page number skeletons */}
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <PageButtonSkeleton key={i} index={i} />
        ))}

      {/* Next button skeleton */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="relative overflow-hidden"
      >
        <div className="w-10 h-10 rounded-lg bg-slate-700/30 border border-white/10 flex items-center justify-center">
          <Shimmer />
        </div>
      </motion.div>
    </div>
  );
};

export default memo(PaginationSkeleton);
