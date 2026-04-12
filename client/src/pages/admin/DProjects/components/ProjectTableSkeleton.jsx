import React, { memo } from "react";
import { motion } from "motion/react";

// Shimmer effect component
const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
);

// Base skeleton block with shimmer
const SkeletonBlock = memo(({ className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay }}
    className={`relative overflow-hidden bg-slate-700/30 rounded-md ${className}`}
  >
    <Shimmer />
  </motion.div>
));

SkeletonBlock.displayName = "SkeletonBlock";

// Header Skeleton Item
const HeaderItem = memo(({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.4,
      delay: index * 0.05,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    className="py-4 px-4 flex justify-center"
  >
    <SkeletonBlock className="w-24 h-4 rounded-md" delay={index * 0.05} />
  </motion.div>
));

HeaderItem.displayName = "HeaderItem";

// Body Skeleton Row
const BodyRow = memo(({ index }) => {
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.08,
      },
    },
  };

  return (
    <motion.div
      variants={rowVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-6 items-center border-b border-white/5 py-3"
    >
      {/* ID */}
      <div className="py-3 px-4 flex justify-center">
        <SkeletonBlock
          className="w-8 h-4 rounded-md"
          delay={index * 0.08 + 0.1}
        />
      </div>

      {/* Title */}
      <div className="py-3 px-4 flex justify-start">
        <SkeletonBlock
          className="w-32 h-4 rounded-md"
          delay={index * 0.08 + 0.15}
        />
      </div>

      {/* Tags */}
      <div className="py-3 px-4 flex justify-center gap-1">
        <SkeletonBlock
          className="w-12 h-5 rounded-md"
          delay={index * 0.08 + 0.2}
        />
        <SkeletonBlock
          className="w-10 h-5 rounded-md"
          delay={index * 0.08 + 0.25}
        />
      </div>

      {/* Tech */}
      <div className="py-3 px-4 flex justify-center gap-1">
        <SkeletonBlock
          className="w-14 h-5 rounded-md"
          delay={index * 0.08 + 0.3}
        />
        <SkeletonBlock
          className="w-12 h-5 rounded-md"
          delay={index * 0.08 + 0.35}
        />
      </div>

      {/* Status */}
      <div className="py-3 px-4 flex justify-center">
        <SkeletonBlock
          className="w-20 h-6 rounded-full"
          delay={index * 0.08 + 0.4}
        />
      </div>

      {/* Action Buttons */}
      <div className="py-3 px-4 flex justify-center gap-2">
        <SkeletonBlock
          className="w-9 h-9 rounded-lg"
          delay={index * 0.08 + 0.45}
        />
        <SkeletonBlock
          className="w-9 h-9 rounded-lg"
          delay={index * 0.08 + 0.5}
        />
      </div>
    </motion.div>
  );
});

BodyRow.displayName = "BodyRow";

export const ProjectHeaderSkeleton = memo(() => {
  const headers = ["ID", "Project", "Tags", "Tech", "Status", "Actions"];

  return (
    <div className="grid grid-cols-6 items-center bg-white/[0.02] border-b border-white/10">
      {headers.map((_, i) => (
        <HeaderItem key={i} index={i} />
      ))}
    </div>
  );
});

ProjectHeaderSkeleton.displayName = "ProjectHeaderSkeleton";

export const ProjectBodySkeleton = memo(() => {
  return (
    <div className="divide-y divide-white/5">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <BodyRow key={i} index={i} />
        ))}
    </div>
  );
});

ProjectBodySkeleton.displayName = "ProjectBodySkeleton";
