import React from 'react'
import { motion } from 'motion/react'
import GardientButton from './GardientButton'

const NextProject = () => {
  // ✅ Unified and optimized animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  }

  const orbFade = (delay = 0) => ({
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut', delay },
    },
  })

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full h-full bg-theme-dark text-white relative bg-circut overflow-hidden font-inter will-change-transform"
    >
      {/* ✅ Background with GPU-friendly smooth scaling */}
      <div className="absolute inset-0 overflow-hidden bg-theme-purple/50"></div>
      <div className="absolute inset-0 overflow-hidden bg-theme-dark/70">
        <motion.div
          variants={orbFade(0)}
          className="md:w-[20vw] md:h-[20vw] sm:w-[40vw] sm:h-[40vw] xs:w-[60vw] xs:h-[60vw] rounded-full bg-theme-purple/25 blur-3xl absolute md:-left-20 md:-bottom-20 will-change-transform"
        />
        <motion.div
          variants={orbFade(0.2)}
          className="md:w-[20vw] md:h-[20vw] sm:w-[40vw] sm:h-[40vw] xs:w-[60vw] xs:h-[60vw] rounded-full bg-theme-cyan/25 blur-3xl absolute md:-right-20 md:-top-20 will-change-transform"
        />
      </div>

      {/* ✅ Main Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center md:py-[10vw] sm:py-[20vw] xs:py-[30vw] text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center"
        >
          <motion.h1
            variants={fadeUp}
            custom={0}
            className="md:text-[3vw] sm:text-[4vw] xs:text-[6vw] font-fira-code font-semibold"
          >
            Ready to Build Your <span className="gradient-text">Next Project?</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={1}
            className="md:text-[1.4vw] sm:text-[2.4vw] xs:text-[4.4vw] text-gray-300 mt-1 mb-3 leading-relaxed md:w-[55%] "
          >
            Let's collaborate to create innovative, high-quality solutions tailored to your needs.
            Get in touch today to discuss your project!
          </motion.p>
          <motion.div
            variants={fadeUp}
            custom={1}
            className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw]"
          >
            <GardientButton text="Contact Me" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default NextProject
