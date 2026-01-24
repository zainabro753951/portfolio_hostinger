import { motion } from 'motion/react'
import { SkeletonBlock } from '../pages/admin/DHome/components/SkeletonBlock'

const FeaturedReposSkeleton = () => {
  const fakeCards = Array(6).fill(0)

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] bg-theme-dark w-full min-h-screen text-white font-inter"
    >
      {/* Title Skeleton */}
      <div className="flex justify-center mb-[3vw]">
        <SkeletonBlock className="h-[3vw] sm:h-[4vw] xs:h-[6vw] w-[40vw] sm:w-[55vw] xs:w-[70vw] rounded-[1vw]" />
      </div>

      {/* Cards Skeleton */}
      <div className="md:my-[1.5vw] sm:my-[2.5vw] xs:my-[3.5vw] grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
        {fakeCards.map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="p-[0.25vw] rounded-[1.5vw]  border border-white/10 backdrop-blur-[2vw] shadow-lg"
          >
            <div className="flex flex-col gap-[1vw] md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw]">
              {/* Image placeholder */}
              <SkeletonBlock className="md:w-full md:h-[20vw] sm:h-[30vw] xs:h-[40vw] rounded-[1vw]" />

              {/* Title placeholder */}
              <SkeletonBlock className="h-[1.6vw] sm:h-[2.6vw] xs:h-[4.6vw] w-[65%] rounded-md" />

              {/* Description placeholders */}
              <div className="flex flex-col gap-[0.6vw]">
                <SkeletonBlock className="h-[1.2vw] sm:h-[2.2vw] xs:h-[4.2vw] w-[90%] rounded-md" />
                <SkeletonBlock className="h-[1.2vw] sm:h-[2.2vw] xs:h-[4.2vw] w-[75%] rounded-md" />
              </div>

              {/* Tech stack and links */}
              <div className="w-full flex flex-col justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <SkeletonBlock className="md:w-[1.2vw] md:h-[1.2vw] sm:w-[2.2vw] sm:h-[2.2vw] xs:w-[3.3vw] xs:h-[3.3vw] rounded-full" />
                  <SkeletonBlock className="h-[1vw] sm:h-[2vw] xs:h-[4vw] w-[40%] rounded-md" />
                </div>
                <div className="w-full flex items-center justify-between mt-[1vw]">
                  <SkeletonBlock className="h-[1.2vw] sm:h-[2.3vw] xs:h-[4.3vw] w-[30%] rounded-md" />
                  <SkeletonBlock className="h-[1.2vw] sm:h-[2.3vw] xs:h-[4.3vw] w-[30%] rounded-md" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Button placeholder */}
      <div className="w-full flex items-center justify-center md:mt-[2.5vw] sm:mt-[3.5vw] xs:mt-[4.5vw]">
        <SkeletonBlock className="h-[3vw] sm:h-[4vw] xs:h-[6vw] w-[25vw] sm:w-[35vw] xs:w-[50vw] rounded-[1.5vw]" />
      </div>
    </motion.section>
  )
}

export default FeaturedReposSkeleton
