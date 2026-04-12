import React, { memo } from "react";
import { motion } from "motion/react";

// Shimmer animation configuration - optimized for performance
const shimmerConfig = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
  },
  transition: {
    repeat: Infinity,
    duration: 1.5,
    ease: "linear",
  },
};

export const SkeletonBlock = memo(({ className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: 1,
      backgroundPosition: shimmerConfig.animate.backgroundPosition,
    }}
    transition={{
      opacity: { duration: 0.3, delay },
      backgroundPosition: shimmerConfig.transition,
    }}
    className={`relative overflow-hidden rounded-lg bg-slate-700/40 ${className}`}
    style={{
      backgroundImage:
        "linear-gradient(110deg, rgba(255,255,255,0.03) 8%, rgba(255,255,255,0.12) 18%, rgba(255,255,255,0.03) 33%)",
      backgroundSize: "200% 100%",
    }}
  />
));

SkeletonBlock.displayName = "SkeletonBlock";
