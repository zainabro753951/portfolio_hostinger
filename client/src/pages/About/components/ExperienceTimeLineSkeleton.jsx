import { motion } from 'motion/react'
import { SkeletonBlock } from '../../admin/DHome/components/SkeletonBlock'

const ExperienceTimelineSkeleton = ({ count = 4 }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full max-w-[90vw] mx-auto
        md:py-[6vw] sm:py-[10vw] xs:py-[12vw]"
    >
      {/* Vertical Line */}
      <div
        className="absolute left-1/2 top-0 bottom-0
        w-[0.25vw] bg-theme-cyan/20
        transform -translate-x-1/2
        md:block xs:hidden"
      />

      <div className="flex flex-col gap-[2.5vw]">
        {Array.from({ length: count }).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`relative
              md:w-[45%] sm:w-[80%] xs:w-[90%]
              p-[0.25vw]
              rounded-[1.2vw]
              bg-linear-to-br from-[#0b0b2a]/60 to-[#0f1040]/30
              border border-white/10 backdrop-blur-[2vw]
              shadow-lg
              ${idx % 2 === 0 ? 'md:self-start sm:ml-[10%]' : 'md:self-end sm:mr-[10%]'}`}
          >
            {/* Dot */}
            <span
              className={`absolute md:block xs:hidden
                top-1/2 w-[1vw] h-[1vw]
                rounded-full bg-theme-cyan/40
                transform -translate-y-1/2
                ${idx % 2 === 0 ? 'right-[-0.6vw]' : 'left-[-0.6vw]'}`}
            />

            {/* Card */}
            <div
              className="w-full h-full
              p-[1.6vw]
              rounded-[1vw]
              bg-white/3
              flex flex-col gap-[1.2vw]"
            >
              {/* Title */}
              <SkeletonBlock className="w-[60%] h-[1.6vw]" />

              {/* Duration */}
              <SkeletonBlock className="w-[40%] h-[1.2vw]" />

              {/* Description */}
              <div className="space-y-[0.6vw]">
                <SkeletonBlock className="w-full h-[1vw]" />
                <SkeletonBlock className="w-[90%] h-[1vw]" />
                <SkeletonBlock className="w-[75%] h-[1vw]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default ExperienceTimelineSkeleton
