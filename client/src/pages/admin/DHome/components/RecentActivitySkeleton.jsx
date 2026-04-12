import React, { memo } from "react";
import { motion } from "motion/react";

// Shimmer animation component for skeleton loading effect
const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
);

// Individual skeleton block with shimmer effect
const SkeletonBlock = memo(({ className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay }}
    className={`relative overflow-hidden bg-slate-700/50 rounded-md ${className}`}
  >
    <Shimmer />
  </motion.div>
));

SkeletonBlock.displayName = "SkeletonBlock";

// Skeleton item for individual activity row
const ActivityItemSkeleton = memo(({ index }) => (
  <motion.li
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.4,
      delay: index * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
  >
    {/* Icon Skeleton */}
    <SkeletonBlock
      className="w-12 h-12 rounded-xl flex-shrink-0"
      delay={index * 0.08 + 0.1}
    />

    {/* Content Skeleton */}
    <div className="flex-1 min-w-0 space-y-3">
      {/* Title row */}
      <div className="flex items-center justify-between gap-3">
        <SkeletonBlock
          className="w-32 h-4 rounded-md"
          delay={index * 0.08 + 0.15}
        />
        <SkeletonBlock
          className="w-16 h-3 rounded-md"
          delay={index * 0.08 + 0.2}
        />
      </div>

      {/* Description */}
      <SkeletonBlock
        className="w-full h-3 rounded-md"
        delay={index * 0.08 + 0.25}
      />

      {/* Meta row */}
      <div className="flex items-center gap-2 pt-1">
        <SkeletonBlock
          className="w-16 h-3 rounded-md"
          delay={index * 0.08 + 0.3}
        />
        <SkeletonBlock
          className="w-20 h-3 rounded-md"
          delay={index * 0.08 + 0.35}
        />
      </div>
    </div>
  </motion.li>
));

ActivityItemSkeleton.displayName = "ActivityItemSkeleton";

export const RecentActivitySkeleton = memo(({ count = 5 }) => {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Header Skeleton */}
      <header className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {/* Bell icon placeholder */}
          <SkeletonBlock className="w-10 h-10 rounded-xl" delay={0.1} />
          <div className="space-y-2">
            <SkeletonBlock className="w-36 h-5 rounded-md" delay={0.15} />
            <SkeletonBlock className="w-48 h-3 rounded-md" delay={0.2} />
          </div>
        </div>
        <SkeletonBlock className="w-20 h-8 rounded-lg" delay={0.25} />
      </header>

      {/* List Skeleton */}
      <div className="p-4">
        <ul className="flex flex-col gap-3 max-h-[400px] overflow-hidden">
          {Array.from({ length: count }).map((_, i) => (
            <ActivityItemSkeleton key={i} index={i} />
          ))}
        </ul>
      </div>

      {/* Footer Skeleton */}
      <footer className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
          <SkeletonBlock className="w-32 h-3 rounded-md" delay={0.4} />
        </div>
        <SkeletonBlock className="w-20 h-8 rounded-lg" delay={0.45} />
      </footer>

      {/* Shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.aside>
  );
});

RecentActivitySkeleton.displayName = "RecentActivitySkeleton";
