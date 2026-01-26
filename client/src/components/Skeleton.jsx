// SkeletonBlock.jsx
import React from "react";

export const Skeleton = ({ className }) => {
  return (
    <div className={`relative overflow-hidden bg-white/10 ${className}`}>
      {/* shimmer wave */}
      <span className="absolute inset-0 -translate-x-full animate-skeleton-wave bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
};
