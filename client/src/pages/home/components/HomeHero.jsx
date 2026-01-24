import React from 'react'
import GardientButton from '../../../components/GardientButton'
import BorderedButton from '../../../components/BorderedButton'
import CircularBadge from '../../../components/CircularBadge'
import { HalfCyanCircles, HalfPurpleCircles } from '../../../components/HalfCircles'
import { motion } from 'motion/react' // ✅ fix import
import { useSelector } from 'react-redux'
import HomeHeroSkeleton from './HomeHeroSkeleton'

const HomeHero = () => {
  const { data: about, isLoading } = useSelector(state => state.about)

  // 🎯 Animation Variants (desktop + mobile friendly)
  const animations = {
    container: {
      hidden: {},
      show: {
        transition: {
          staggerChildren: 0.25, // smooth delay between h1, p, etc.
        },
      },
    },
    fadeUp: {
      hidden: { y: 60, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: 'easeOut' },
      },
    },
  }

  return (
    <div className="w-full h-full bg-theme-dark text-white relative bg-circut">
      {isLoading ? (
        <HomeHeroSkeleton />
      ) : (
        <div className="w-full h-full bg-theme-dark/80 relative">
          {/* Purple Shadow Circle */}
          <div className="purple-shadow-circle md:w-[20vw] md:h-[20vw] sm:w-[40vw] sm:h-[40vw] xs:w-[60vw] xs:h-[60vw] rounded-full bg-theme-purple/20 blur-3xl absolute md:-left-36 md:-top-20"></div>

          {/* Content Wrapper */}
          <div className="w-full md:h-screen md:py-[4vw] sm:py-[7vw] xs:py-[16vw] md:mt-[3vw] sm:mt-[4vw] xs:mt-[5vw] grid xs:grid-cols-1 md:grid-cols-2 md:gap-[6vw] sm:gap-[10vw] xs:gap-[20vw] md:place-items-center items-center md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] overflow-hidden">
            {/* Bio data container */}
            <motion.div
              variants={animations.container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }} // ✅ trigger once for better performance
              className="flex flex-col md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[2.5vw]"
            >
              <motion.h1
                variants={animations.fadeUp}
                className="md:text-[4.5vw] sm:text-[5.5vw] xs:text-[8.5vw] font-semibold font-fira-code md:leading-[5.5vw] sm:leading-[6.5vw] xs:leading-[10vw]"
              >
                {about?.shortRole ? (
                  (() => {
                    const words = about.shortRole.split(' ')
                    const normalWords = words.slice(0, -2).join(' ')
                    const lastTwoWords = words.slice(-2).join(' ')

                    return (
                      <>
                        {normalWords && `${normalWords} `}
                        <span className="gradient-text">{lastTwoWords}</span>
                      </>
                    )
                  })()
                ) : (
                  <>
                    Building <span className="gradient-text">Digital Solutions</span>
                  </>
                )}
              </motion.h1>

              <motion.p
                variants={animations.fadeUp}
                className="md:text-[1.5vw] sm:text-[2.5vw] xs:text-[4.5vw] font-inter text-gray-300 md:w-[95%]"
              >
                {about?.shortDesc ||
                  `Full-stack developer specializing in modern web technologies. I create scalable
              applications with clean code and exceptional user experiences using React, Node.js,
              and cloud platforms.`}
              </motion.p>

              <motion.div
                variants={animations.fadeUp}
                className="grid md:grid-cols-2 items-center md:w-[70%] md:gap-[2vw] sm:gap-[2.5vw] xs:gap-[3vw] md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] font-inter"
              >
                <GardientButton
                  text="View Projects"
                  hoverOpacity={false}
                  hoverShadow={true}
                  link="/projects"
                />
                <BorderedButton text="Get In Touch" link={'/contact'} />
              </motion.div>
            </motion.div>

            {/* Circular badge container */}
            <motion.div
              variants={animations.fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="flex items-center justify-center relative"
            >
              <div className="flex items-center absolute">
                <HalfPurpleCircles />
                <HalfCyanCircles />
              </div>
              <div className="w-full h-full flex items-center justify-center">
                <CircularBadge aboutImage={about?.aboutImage || null} />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomeHero
