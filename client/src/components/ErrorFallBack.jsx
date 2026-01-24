import { motion } from 'motion/react'

export default function ErrorFallback({ onRetry }) {
  return (
    <div className="w-full flex items-center justify-center h-screen font-inter bg-gradient-to-br from-[#0b1120] via-[#0f1e3a] to-[#111827] relative overflow-hidden text-white">
      {/* 🔵 Floating gradient blobs for ambient light */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute top-[-10%] left-[-10%] w-[35vw] h-[35vw] bg-cyan-500/30 rounded-full blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
        className="absolute bottom-[-15%] right-[-10%] w-[40vw] h-[40vw] bg-pink-500/30 rounded-full blur-[140px]"
      />

      {/* 💎 Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        className="md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      border border-cyan-400/20 bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
      backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
      md:mt-[2vw] sm:mt-[3vw] xs:mt-[4vw] relative md:p-[2vw] sm:p-[3vw] xs:p-[4vw] flex flex-col items-center "
      >
        <motion.div
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="md:text-[5vw] sm:text-[6vw] xs:text-[7vw] md:mb-[1.5vw] sm:mb-[2.5vw] xs:mb-[3.5vw]"
        >
          ⚠️
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white md:text-[2vw] sm:text-[3vw] xs:text-[5vw] font-semibold mb-1"
        >
          Failed to Load Site Data
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw] text-center md:mb-[2vw] sm:mb-[3vw] xs:mb-[4vw] leading-relaxed"
        >
          Something went wrong while fetching your data.
          <br /> Please check your connection and try again.
        </motion.p>

        <div className="w-full flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry || (() => window.location.reload())}
            className="md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw] bg-gradient-to-r from-cyan-500 to-blue-500 text-cyan-100 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.25)] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] md:text-[1vw] sm:text-[2vw] xs:text-[4vw] flex items-center justify-center"
          >
            Retry
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
