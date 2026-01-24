import React, { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { colorGuess } from '../../../Utils/Utils'

const ProjectHero = ({ isLoading, projectData }) => {
  const [firstTwoWords, setFirstTwoWords] = useState('')
  const [normalWords, setNormalWords] = useState('')
  const [color, setColor] = useState('')
  const [projectImages, setProjectImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  // Select image by index
  const handleShuffleImage = useCallback(
    idx => {
      if (!projectImages || projectImages.length === 0) return
      setSelectedImage(projectImages[idx] ?? null)
    },
    [projectImages]
  )

  useEffect(() => {
    if (!isLoading && projectData) {
      // Split title into first 2 words + rest
      const words = projectData.title?.split(' ') || []
      setFirstTwoWords(words.slice(0, 2).join(' '))
      setNormalWords(words.slice(2).join(' '))

      // Get tech stack color
      const techName = projectData?.techStack?.[0]?.name ?? ''
      setColor(colorGuess(techName))

      // Combine images safely
      const images = [
        ...(projectData?.heroImage ? [projectData.heroImage] : []),
        ...(Array.isArray(projectData?.gallery) ? projectData.gallery : []),
        ...(projectData?.ogProjectImage ? [projectData.ogProjectImage] : []),
      ]
      setProjectImages(images)

      // Select the first image by default
      setSelectedImage(images[0] ?? null)
    } else {
      // Reset states if loading or no projectData
      setFirstTwoWords('')
      setNormalWords('')
      setColor('')
      setProjectImages([])
      setSelectedImage(null)
    }
  }, [isLoading, projectData])

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
  console.log(selectedImage)

  return (
    <div className="w-full bg-theme-dark text-white relative bg-circut overflow-hidden font-inter will-change-transform md:py-[10vw] sm:py-[15vw] xs:py-[20vw] md:px-[3vw] sm:px-[5vw] xs:px-[6vw]">
      {/* ✅ Background simplified & GPU accelerated */}
      <div className="absolute inset-0 overflow-hidden bg-theme-dark/70 will-change-transform">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="md:w-[20vw] md:h-[20vw] sm:w-[40vw] sm:h-[40vw] rounded-full bg-theme-purple/25 blur-3xl absolute md:-left-20 md:-bottom-20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="md:w-[20vw] md:h-[20vw] sm:w-[40vw] sm:h-[40vw] rounded-full bg-theme-cyan/25 blur-3xl absolute md:-right-20 md:-top-20"
        />
      </div>
      {/* Main Content */}
      <div className="w-full h-full relative grid md:grid-cols-2 md:gap-[5vw] sm:gap-[7vw] xs:gap-[9vw] place-content-center  items-center">
        <div className="flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
          <motion.h1
            variants={animations.fadeUp}
            className="md:text-[3.5vw] sm:text-[4.5vw] xs:text-[6.5vw] font-semibold font-fira-code md:leading-[4.5vw] sm:leading-[5.5vw] xs:leading-[8vw]"
          >
            <span className="gradient-text">{firstTwoWords}</span> {normalWords}
          </motion.h1>
          <motion.p
            variants={animations.fadeUp}
            className="md:text-[1.4vw] sm:text-[2.4vw] xs:text-[4.4vw] font-inter text-gray-300 md:w-[95%]"
          >
            {projectData?.shortDesc ||
              `Full-stack developer specializing in modern web technologies. I create scalable
                        applications with clean code and exceptional user experiences using React, Node.js,
                        and cloud platforms.`}
          </motion.p>
          <div className="md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw] text-gray-400 flex items-center gap-2">
            <div
              className="md:w-[1.2vw] md:h-[1.2vw] sm:w-[2.2vw] sm:h-[2.2vw] xs:w-[3.3vw] xs:h-[3.3vw] rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <p>{projectData?.techStack?.[0]?.name ?? ''}</p>
          </div>

          <div className="grid md:grid-cols-2">
            <motion.div
              variants={animations.fadeUp}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: '0 0 10px #06b5d46c, 0 0 20px #06b5d463, 0 0 30px #06b5d442',
              }}
              transition={{ duration: 0.3 }}
              className="md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] gradient-button"
            >
              <div className="w-full h-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] bg-theme-dark md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] ">
                <h5 className="md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw] font-inter text-gray-300 ">
                  Duration
                </h5>
                <h5 className="md:text-[1.4vw] sm:text-[2.4vw] xs:text-[4.4vw] font-inter ">
                  {projectData?.estTime} Days
                </h5>
              </div>
            </motion.div>
          </div>

          <div className="w-full flex md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[3vw]">
            <a
              href={projectData?.liveDemo}
              target="_blank"
              className="
    group relative inline-block overflow-hidden
    md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw]
    md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw]
    md:px-[2vw] sm:px-[2.5vw] xs:px-[3vw]
    md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw]
    border-2 border-theme-purple
    font-medium select-none
  "
            >
              <span
                className="
      absolute inset-0
      bg-gradient-to-r from-[#9235ea] via-[#5161cf] to-[#06b6d4]
      transition-opacity duration-300
      group-hover:opacity-0
    "
              ></span>

              <span
                className="
      absolute inset-0
      opacity-0 transition-opacity duration-300
      group-hover:opacity-100
    "
              ></span>

              <span className="relative z-10">Live Demo</span>
            </a>
            <a
              href={projectData?.repoLink}
              target="_blank"
              className="
    group relative inline-block overflow-hidden
    md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw]
    md:py-[1vw] sm:py-[1.5vw] xs:py-[2vw]
    md:px-[2vw] sm:px-[2.5vw] xs:px-[3vw]
    md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw]
    border-2 border-theme-cyan
    font-medium select-none
  "
            >
              {/* Gradient (shows on hover) */}
              <span
                className="
      absolute inset-0 rounded-inherit
      bg-gradient-to-r from-[#9235ea] via-[#5161cf] to-[#06b6d4]
      opacity-0 group-hover:opacity-100
      transition-opacity duration-300
    "
              ></span>

              {/* Dark background (normal state) */}
              <span
                className="
      absolute inset-0 rounded-inherit
      bg-theme-dark
      opacity-100 group-hover:opacity-0
      transition-opacity duration-300
    "
              ></span>

              {/* Button text */}
              <span className="relative z-10">Repository</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[2.5vw]">
          <motion.div
            variants={animations.fadeUp}
            whileHover={{
              y: -8,
              scale: 1.02,
              boxShadow: '0 0 10px #06b5d46c, 0 0 20px #06b5d463, 0 0 30px #06b5d442',
            }}
            transition={{ duration: 0.3 }}
            className="md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] gradient-button w-full"
          >
            <div className="w-full md:h-[30vw] sm:h-[40vw] xs:h-[50vw] overflow-hidden bg-theme-dark md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] ">
              <img className="w-full h-full object-cover" src={selectedImage?.url} alt="" />
            </div>
          </motion.div>

          <div className="flex items-center justify-center w-full">
            <div className="flex items-center md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[2.5vw]">
              {projectImages?.map((item, idx) => {
                const isSelected = selectedImage === item

                return (
                  <motion.div
                    key={idx}
                    onClick={() => handleShuffleImage(idx)}
                    variants={animations.fadeUp}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      boxShadow: '0 0 10px #06b5d46c, 0 0 20px #06b5d463, 0 0 30px #06b5d442',
                    }}
                    transition={{ duration: 0.3 }}
                    className={`
        md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw]
        md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw]
        overflow-hidden
        md:w-[5.5vw] md:h-[5.5vw] sm:w-[7.5vw] sm:h-[7.5vw] xs:w-[9.5vw] xs:h-[9.5vw]
        border-2
        ${isSelected ? 'border-theme-cyan' : 'border-transparent'}
        transition-all duration-300
      `}
                  >
                    <img className="w-full h-full object-cover" src={item?.url} alt="" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectHero
