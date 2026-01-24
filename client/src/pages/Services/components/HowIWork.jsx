import React from 'react'
import { motion } from 'motion/react'

const HowIWork = () => {
  const webAppProcess = [
    {
      title: 'Consultation & Planning',
      desc: 'Understanding your goals and defining a clear roadmap for the web application.',
    },
    {
      title: 'Architecture & Setup',
      desc: 'Setting up a scalable project structure with essential tools and configurations.',
    },
    {
      title: 'Frontend & Backend Development',
      desc: 'Building a full-stack web app with secure APIs and responsive UI for smooth performance.',
    },
    {
      title: 'Testing & Quality Assurance',
      desc: 'Ensuring flawless performance through detailed testing and code optimization.',
    },
    {
      title: 'Deployment & Ongoing Support',
      desc: 'Deploying the app and providing continuous updates and maintenance for stability.',
    },
  ]

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    show: i => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
      className="md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] bg-theme-dark/90 backdrop-blur-md w-full text-white font-inter overflow-hidden"
    >
      {/* Heading Animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="text-center mb-[5vw]"
      >
        <h1 className="md:text-[3.5vw] sm:text-[5vw] xs:text-[7vw] font-fira-code font-semibold">
          How <span className="gradient-text">I Work</span>
        </h1>
      </motion.div>

      {/* Process Cards */}
      <div className="w-full grid md:grid-cols-5 sm:grid-cols-2 xs:grid-cols-1 md:gap-[2.5vw] sm:gap-[3vw] xs:gap-[4vw] justify-center relative">
        <motion.div
          initial={{
            width: 0,
          }}
          whileInView={{
            width: '100%',
          }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: 'easeOut',
          }}
          layout
          className="w-full md:h-[0.25vw] gradient-button absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        ></motion.div>
        {webAppProcess.map((item, idx) => (
          <motion.div
            key={idx}
            custom={idx}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{
              y: -8,
              scale: 1.02,
              boxShadow: '0 0 10px #06b5d46c, 0 0 20px #06b5d463, 0 0 30px #06b5d442',
            }}
            transition={{ duration: 0.3 }}
            className="relative md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] gradient-button w-full"
          >
            <div className="w-full h-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] bg-theme-dark md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] flex flex-col md:gap-[1.2vw] sm:gap-[1.8vw] xs:gap-[2.5vw] transition-all duration-300 ease-out">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="md:text-[1.6vw] sm:text-[2.6vw] xs:text-[4.6vw] md:leading-[2.1vw] sm:leading-[3.1vw] xs:leading-[5.1vw] font-semibold font-fira-code text-theme-cyan"
              >
                {item.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] text-gray-300 leading-relaxed"
              >
                {item.desc}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default HowIWork
