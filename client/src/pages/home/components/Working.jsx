import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaCode, FaDatabase, FaUserLock } from 'react-icons/fa6'
import { FiCpu } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { useGetServiceIcon } from '../../../Utils/GetServiceIcon'
import ServiceSkeleton from '../../../components/ServiceSkeleton'

// 🎬 Animation Variants (Highly optimized & reusable)
const fadeUp = {
  initial: { y: 40, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const containerVariant = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const Working = () => {
  const { services, isLoading } = useSelector(state => state.service)
  const [isPageReady, setIsPageReady] = useState(false)

  // ⏳ Wait until loading finishes before animating
  useEffect(() => {
    if (!isLoading && services?.length > 0) {
      // Small delay for smooth transition after skeleton disappears
      const timeout = setTimeout(() => setIsPageReady(true), 200)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, services])

  // 🧠 Prepare cards only when data is ready
  const cards =
    services?.map(item => ({
      icon: useGetServiceIcon(item.title),
      title: item.title,
      desc: item.shortDesc,
    })) || []

  if (isLoading || !isPageReady) return <ServiceSkeleton />

  return (
    <motion.div
      className="w-full text-white bg-circut font-inter"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="w-full h-full bg-theme-dark/80">
        <div className="w-full h-full md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] bg-theme-purple/10">
          {/* Section Heading */}
          <motion.h2
            variants={fadeUp}
            className="md:text-[2.9vw] sm:text-[3.9vw] xs:text-[5.9vw] font-fira-code font-semibold text-center"
          >
            How <span className="gradient-text">I Can Help</span>
          </motion.h2>

          {/* Cards Container */}
          <motion.div
            variants={containerVariant}
            initial="initial"
            animate="animate"
            className="md:mt-[1.5vw] sm:mt-[2.5vw] xs:mt-[3.5vw] grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]"
          >
            {cards.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 0 10px #06b5d46c, 0 0 20px #06b5d463, 0 0 30px #06b5d442',
                }}
                transition={{ duration: 0.3 }}
                className="md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] gradient-button"
              >
                <div className="w-full h-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] bg-theme-dark md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] flex flex-col md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[2.5vw]">
                  <span className="md:text-[3vw] sm:text-[4vw] xs:text-[6vw] text-theme-cyan">
                    {item.icon}
                  </span>
                  <h2 className="md:text-[1.6vw] sm:text-[2.6vw] xs:text-[4.6vw] md:leading-[2.1vw] sm:leading-[3.1vw] xs:leading-[5.1vw] font-semibold font-fira-code">
                    {item.title}
                  </h2>
                  <p className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Working
