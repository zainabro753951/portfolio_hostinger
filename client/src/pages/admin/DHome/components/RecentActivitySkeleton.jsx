import { motion } from 'motion/react'
import { SkeletonBlock } from './SkeletonBlock'

export const RecentActivitySkeleton = ({ count = 5 }) => {
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[90vw] md:max-w-[50vw] p-[2vw] md:p-[1.5vw] rounded-[1.5vw]
        bg-linear-to-br from-[#0b0b2a]/60 to-[#0f1040]/30
        border border-white/10 backdrop-blur-[2vw] shadow-lg"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-[1.5vw] gap-[1vw]">
        <div className="space-y-[0.6vw]">
          <SkeletonBlock className="w-[14vw] h-[1.4vw]" />
          <SkeletonBlock className="w-[18vw] h-[1vw]" />
        </div>
        <SkeletonBlock className="w-[6vw] h-[1.6vw]" />
      </div>

      {/* List */}
      <ul className="flex flex-col gap-[1vw] max-h-[50vh] overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="flex items-start gap-[1vw] p-[1vw] rounded-[1vw] bg-white/3">
            {/* Icon */}
            <SkeletonBlock className="w-[3vw] h-[3vw] rounded-[0.8vw]" />

            {/* Content */}
            <div className="flex-1 space-y-[0.6vw]">
              <div className="flex justify-between gap-[1vw]">
                <SkeletonBlock className="w-[18vw] h-[1vw]" />
                <SkeletonBlock className="w-[4vw] h-[0.8vw]" />
              </div>
              <SkeletonBlock className="w-[100%] h-[0.9vw]" />
              <div className="flex gap-[0.6vw]">
                <SkeletonBlock className="w-[6vw] h-[0.8vw]" />
                <SkeletonBlock className="w-[5vw] h-[0.8vw]" />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="mt-[1vw] flex justify-between">
        <SkeletonBlock className="w-[12vw] h-[0.8vw]" />
        <SkeletonBlock className="w-[5vw] h-[1.2vw]" />
      </div>
    </motion.aside>
  )
}
