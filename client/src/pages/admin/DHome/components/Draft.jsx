import React from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const Draft = () => {
  const drafts = [
    'Landing page redesign',
    'Blog: Optimizing GSAP animations',
    'Portfolio dark mode update',
  ]

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 0 10px #06b5d46c, 0 0 20px #06b5d463, 0 0 30px #06b5d442',
      }}
      transition={{ duration: 0.3 }}
      className="md:w-full md:p-[1.5vw] sm:p-[2.5vw] xs:p-[3.5vw]
                 md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw]
                 bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
                 border border-white/20 backdrop-blur-2xl"
    >
      <h4 className="md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw] font-semibold text-white">
        Drafts
      </h4>
      <div className="md:mt-[1vw] sm:mt-[1.5vw] xs:mt-[2vw] flex flex-col gap-1">
        {drafts.map((draft, idx) => (
          <p
            key={idx}
            className="md:text-[1vw] sm:text-[2vw] xs:text-[4vw] text-gray-400 hover:text-cyan-300 transition-colors duration-200"
          >
            {draft}
          </p>
        ))}
      </div>
    </motion.div>
  )
}

export default Draft
