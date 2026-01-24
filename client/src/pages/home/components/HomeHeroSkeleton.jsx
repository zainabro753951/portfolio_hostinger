import { motion } from 'motion/react'
import { SkeletonBlock } from '../../admin/DHome/components/SkeletonBlock'

const HomeHeroSkeleton = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full bg-theme-dark/80 relative overflow-hidden"
    >
      {/* Purple Shadow Circle */}
      <motion.div
        className="absolute md:-left-36 md:-top-20
          md:w-[20vw] md:h-[20vw] sm:w-[40vw] sm:h-[40vw] xs:w-[60vw] xs:h-[60vw]
          rounded-full bg-theme-purple/20 blur-3xl animate-pulse-slow"
      />

      {/* Content Wrapper */}
      <div
        className="w-full md:h-screen md:py-[4vw] sm:py-[7vw] xs:py-[16vw]
        grid xs:grid-cols-1 md:grid-cols-2 md:gap-[6vw] sm:gap-[10vw] xs:gap-[20vw]
        md:place-items-center items-center md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw]"
      >
        {/* Bio Skeleton */}
        <div className="flex flex-col md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[2.5vw] w-full">
          <SkeletonBlock className="w-[70%] h-[4vw] sm:h-[5vw] xs:h-[8vw] rounded-md bg-gradient-to-r from-theme-purple/40 to-theme-cyan/40 animate-shimmer" />

          <div className="space-y-[1vw] md:w-[95%]">
            <SkeletonBlock className="w-full h-[1.5vw] sm:h-[2.5vw] xs:h-[4vw] rounded-md bg-theme-dark/40 animate-shimmer" />
            <SkeletonBlock className="w-[85%] h-[1.5vw] sm:h-[2.5vw] xs:h-[4vw] rounded-md bg-theme-dark/40 animate-shimmer" />
            <SkeletonBlock className="w-[75%] h-[1.5vw] sm:h-[2.5vw] xs:h-[4vw] rounded-md bg-theme-dark/40 animate-shimmer" />
          </div>

          {/* Buttons */}
          <div className="grid md:grid-cols-2 md:w-[70%] md:gap-[2vw] sm:gap-[2.5vw] xs:gap-[3vw]">
            <SkeletonBlock className="w-full h-[3vw] sm:h-[5vw] xs:h-[8vw] rounded-md bg-theme-purple/30 animate-shimmer" />
            <SkeletonBlock className="w-full h-[3vw] sm:h-[5vw] xs:h-[8vw] rounded-md bg-theme-cyan/30 animate-shimmer" />
          </div>
        </div>

        {/* Circular Badge Skeleton */}
        <div className="flex items-center justify-center relative">
          <div className="absolute flex items-center">
            <SkeletonBlock className="w-[10vw] h-[10vw] sm:w-[20vw] sm:h-[20vw] xs:w-[30vw] xs:h-[30vw] rounded-full border-[0.8vw] border-theme-purple/40 blur-md animate-shimmer" />
            <SkeletonBlock className="w-[10vw] h-[10vw] sm:w-[20vw] sm:h-[20vw] xs:w-[30vw] xs:h-[30vw] rounded-full border-[0.8vw] border-theme-cyan/40 blur-md rotate-45 animate-shimmer" />
          </div>
          <SkeletonBlock className="w-[12vw] h-[12vw] sm:w-[25vw] sm:h-[25vw] xs:w-[40vw] xs:h-[40vw] rounded-full border border-gray-400/10 bg-gray-500/20 animate-shimmer" />
        </div>
      </div>
    </motion.section>
  )
}

export default HomeHeroSkeleton
