import { motion } from 'motion/react'
import { SkeletonBlock } from '../../admin/DHome/components/SkeletonBlock'

const PricingFaqSkeleton = () => {
  const cards = [1, 2, 3]
  const faqs = [1, 2, 3]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-theme-dark text-white relative"
    >
      <div className="w-full h-full bg-theme-dark/80 relative">
        <div className="w-full h-full md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] flex flex-col md:gap-[4vw] sm:gap-[5vw] xs:gap-[6vw]">
          {/* ===== Pricing Skeleton ===== */}
          <motion.div>
            <div className="flex justify-center mb-[2vw]">
              <SkeletonBlock className="h-[3vw] md:w-[20vw] sm:w-[30vw] xs:w-[50vw] rounded-md" />
            </div>

            <div className="md:mt-[1.5vw] sm:mt-[2.5vw] xs:mt-[3.5vw] grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
              {cards.map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-[0.25vw] rounded-[1.2vw]  border border-white/10 backdrop-blur-[1.5vw] shadow-lg"
                >
                  <div className="flex flex-col md:gap-[1vw] sm:gap-[1.5vw] xs:gap-[2vw] md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw]">
                    <SkeletonBlock className="w-[50%] h-[2vw] rounded-md" />
                    <SkeletonBlock className="w-[40%] h-[3vw] rounded-md" />
                    <SkeletonBlock className="w-[90%] h-[1.5vw] rounded-md" />

                    <div className="flex flex-col gap-[0.8vw] mt-[1vw]">
                      {[...Array(5)].map((_, idy) => (
                        <SkeletonBlock key={idy} className="w-[85%] h-[1.5vw] rounded-md" />
                      ))}
                    </div>

                    <SkeletonBlock className="mt-[1.5vw] w-[60%] h-[2.5vw] rounded-md" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ===== FAQ Skeleton ===== */}
          <motion.div>
            <div className="flex justify-center mb-[2vw]">
              <SkeletonBlock className="h-[3vw] md:w-[25vw] sm:w-[35vw] xs:w-[50vw] rounded-md" />
            </div>

            <div className="md:max-w-[60%] h-full mx-auto md:mt-[2.5vw] sm:mt-[3.5vw] xs:mt-[4.5vw] flex flex-col gap-[1vw]">
              {faqs.map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-[0.25vw] rounded-[1.2vw]  border border-white/10 backdrop-blur-[1.5vw] shadow-lg"
                >
                  <div className="flex flex-col gap-[1vw] md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw]">
                    <SkeletonBlock className="w-[80%] h-[2vw] rounded-md" />
                    <SkeletonBlock className="w-[95%] h-[1.5vw] rounded-md" />
                    <SkeletonBlock className="w-[85%] h-[1.5vw] rounded-md" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default PricingFaqSkeleton
