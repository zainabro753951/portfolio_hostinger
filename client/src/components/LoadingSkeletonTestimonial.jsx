import { motion } from 'motion/react'
import { SkeletonBlock } from '../pages/admin/DHome/components/SkeletonBlock'

const LoadingSkeletonTestimonials = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] bg-theme-purple/10 w-full font-inter"
    >
      <div className="md:max-w-[75%] mx-auto relative flex justify-center">
        {/* Skeleton Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-[0.25vw] rounded-[1.5vw] bg-linear-to-br from-[#1f1f1f]/60 via-[#2a2a2a]/40 to-[#1f1f1f]/60 border border-white/10 backdrop-blur-[2vw] shadow-lg w-[90%] md:w-[70%]"
        >
          <div className="flex flex-col md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] gap-[1.5vw]">
            {/* Skeleton Message */}
            <SkeletonBlock className="md:h-[6vw] sm:h-[10vw] xs:h-[18vw] w-full rounded-lg" />

            {/* Client Section */}
            <div className="flex items-center md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
              <SkeletonBlock className="rounded-full md:w-[3.5vw] md:h-[3.5vw] sm:w-[5.5vw] sm:h-[5.5vw] xs:w-[7.5vw] xs:h-[7.5vw]" />
              <div className="flex flex-col md:gap-[0.5vw] sm:gap-[1vw] xs:gap-[2vw]">
                <SkeletonBlock className="md:h-[1.2vw] sm:h-[2vw] xs:h-[3.5vw] md:w-[10vw] sm:w-[18vw] xs:w-[25vw] rounded-md" />
                <SkeletonBlock className="md:h-[0.9vw] sm:h-[1.8vw] xs:h-[3vw] md:w-[8vw] sm:w-[14vw] xs:w-[20vw] rounded-md" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Left Button Skeleton */}
        <div className="absolute left-[3%] top-1/2 -translate-y-1/2 z-10">
          <SkeletonBlock className="bg-gradient-to-r from-purple-600 to-blue-500 opacity-40 md:p-[1vw] sm:p-[2vw] xs:p-[4vw] rounded-full" />
        </div>

        {/* Right Button Skeleton */}
        <div className="absolute right-[3%] top-1/2 -translate-y-1/2 z-10">
          <SkeletonBlock className="bg-gradient-to-r from-purple-600 to-blue-500 opacity-40 md:p-[1vw] sm:p-[2vw] xs:p-[4vw] rounded-full" />
        </div>
      </div>

      {/* Pagination Dots Skeleton */}
      <div className="flex justify-center md:gap-[1vw] sm:gap-[1.5vw] xs:gap-[2vw] md:mt-[3vw] sm:mt-[4vw] xs:mt-[5vw]">
        {[...Array(3)].map((_, idx) => (
          <SkeletonBlock key={idx} className="w-[10px] h-[10px] rounded-full" />
        ))}
      </div>
    </motion.section>
  )
}

export default LoadingSkeletonTestimonials
