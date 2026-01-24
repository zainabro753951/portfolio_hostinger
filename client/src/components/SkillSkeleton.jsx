import React from 'react'
import { motion } from 'framer-motion'

const SkillSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 items-center md:gap-[5vw] sm:gap-[6vw] xs:gap-[8vw] w-full md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] px-5">
      {/* 🧠 Left Section Skeleton */}
      <div className="flex flex-col md:gap-[2vw] sm:gap-[3vw] xs:gap-[4vw] w-full animate-pulse">
        {/* 👤 Intro Skeleton */}
        <div>
          <div className="bg-theme-cyan/20 rounded-md md:h-[2.5vw] sm:h-[3.5vw] xs:h-[6vw] w-[60%] mb-[1vw]" />
          <div className="bg-gray-700/60 rounded-md md:h-[1.2vw] sm:h-[2.2vw] xs:h-[4.2vw] w-[90%] mb-[0.8vw]" />
          <div className="bg-gray-700/60 rounded-md md:h-[1.2vw] sm:h-[2.2vw] xs:h-[4.2vw] w-[80%]" />
        </div>

        {/* 💼 Work History Skeleton */}
        <div>
          <div className="bg-theme-cyan/20 rounded-md md:h-[1.7vw] sm:h-[2.7vw] xs:h-[4.7vw] w-[40%] mb-[1vw]" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="mb-[1.5vw]">
              <div className="bg-gray-700/60 rounded-md md:h-[1.2vw] sm:h-[2.3vw] xs:h-[4.3vw] w-[80%] mb-[0.6vw]" />
              <div className="bg-gray-700/40 rounded-md md:h-[1vw] sm:h-[2vw] xs:h-[3.5vw] w-[70%]" />
            </div>
          ))}
        </div>

        {/* 🧩 Skills Skeleton */}
        <div>
          <div className="bg-theme-cyan/20 rounded-md md:h-[1.7vw] sm:h-[2.7vw] xs:h-[4.7vw] w-[30%] mb-[1vw]" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full mb-[1vw]">
              <div className="flex justify-between items-center mb-1">
                <div className="bg-gray-700/60 rounded-md md:h-[1.2vw] sm:h-[2.3vw] xs:h-[4.3vw] w-[40%]" />
                <div className="bg-gray-700/60 rounded-md md:h-[1vw] sm:h-[2vw] xs:h-[3.8vw] w-[10%]" />
              </div>
              <div className="relative w-full bg-gray-800/70 rounded-full overflow-hidden md:h-[1vw] sm:h-[1.8vw] xs:h-[2.5vw]">
                <motion.div
                  className="absolute top-0 left-0 h-full w-[60%] bg-gradient-to-r from-[#06b5d4]/60 to-transparent rounded-r-full"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🖼️ Right Section Skeleton (Image) */}
      <motion.div
        className="w-full h-full border border-theme-cyan/30 bg-gray-800/40 md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw] overflow-hidden relative"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#06b5d4]/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
      </motion.div>
    </div>
  )
}

export default SkillSkeleton
