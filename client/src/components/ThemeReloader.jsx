import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const messages = [
  'Loading…',
  'Preparing your experience…',
  'Optimizing performance…',
  'Fetching essentials…',
  'Almost ready…',
  'Just a moment…',
]

const ThemeReloader = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % messages.length)
    }, 3500) // 3.5 sec per text

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      {/* GIF Loader */}
      <img
        className="md:w-[45%] xs:w-[80%] object-cover object-center"
        src="/imgs/reloader.gif"
        alt=""
      />

      {/* Animated Text */}
      <div className="relative md:-top-24 sm:top-16 xs:-top-7 h-[4vw] flex items-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="reloader-text md:text-[2.8vw] sm:text-[3.8vw] xs:text-[5.8vw] font-bold font-fira-code text-center"
          >
            {messages[index]}
          </motion.h1>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ThemeReloader
