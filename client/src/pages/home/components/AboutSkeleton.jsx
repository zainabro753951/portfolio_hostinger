import { motion } from 'motion/react'
import { SkeletonBlock } from '../../admin/DHome/components/SkeletonBlock'

const AboutSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-theme-dark text-white font-inter overflow-hidden
        md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw]"
    >
      <div className="w-full h-full grid md:grid-cols-2 md:gap-[2.5vw] sm:gap-[3.5vw] xs:gap-[4.5vw] items-center">
        {/* 🦴 Experience Cards Skeleton */}
        <div className="grid md:grid-cols-2 md:gap-[2vw] sm:gap-[3vw] xs:gap-[4vw]">
          {[1, 2, 3, 4].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-[1.25vw] rounded-[1.2vw]
                bg-linear-to-br from-[#0b0b2a]/60 to-[#0f1040]/30
                border border-white/10 backdrop-blur-[2vw] shadow-lg"
            >
              <div className="flex flex-col gap-[0.8vw] w-full h-full">
                <SkeletonBlock className="w-[4vw] h-[4vw] rounded-full mb-[0.6vw]" />
                <SkeletonBlock className="w-[5vw] h-[2vw] rounded-md" />
                <SkeletonBlock className="w-[70%] h-[1.3vw] rounded-md" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 🧠 Code Block Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-[0.8vw]"
        >
          <SkeletonBlock className="w-[80%] h-[2vw] rounded-md" />
          {[...Array(6)].map((_, idx) => (
            <SkeletonBlock key={idx} className="w-full h-[1.2vw] rounded-md" />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AboutSkeleton
