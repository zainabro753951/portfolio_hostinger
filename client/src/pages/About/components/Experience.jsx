import React from 'react'
import { motion } from 'framer-motion'
import { FaCircle } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import ExperienceTimelineSkeleton from './ExperienceTimeLineSkeleton'

const fadeUp = {
  hidden: { opacity: 0, y: 100, rotateX: -10 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      type: 'spring',
      stiffness: 80,
      damping: 12,
    },
  },
}

const ExperienceTimeline = () => {
  const { experiences, isLoading } = useSelector(state => state.experience)
  console.log(experiences)

  const exp = [
    {
      title: 'Senior Developer, TechCorp',
      duration: '2022 - Present',
      desc: 'Leading a team to develop a cloud-based SaaS platform leveraging React and AWS to deliver scalable solutions that enhanced client productivity by 40%.',
    },
    {
      title: 'Full Stack Developer, Innovate Solutions',
      duration: '2018 - 2022',
      desc: 'Built e-commerce platforms using Node.js and MongoDB, resulting in a 30% revenue increase for clients through optimized user experiences.',
    },
    {
      title: 'Frontend Developer, Pixel Studio',
      duration: '2016 - 2018',
      desc: 'Created responsive UI components with React and GSAP for motion-rich websites.',
    },
  ]

  if (isLoading) return <ExperienceTimelineSkeleton />

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      className="relative md:w-[80%] mx-auto md:py-[8vw] sm:py-[12vw] xs:py-[14vw]"
    >
      {/* Vertical timeline line */}
      <motion.div
        initial={{
          height: 0,
        }}
        whileInView={{
          height: '100%',
        }}
        transition={{
          duration: 1,
          delay: 0.3,
          ease: 'easeOut',
        }}
        layout
        className="absolute left-1/2 top-0 bottom-0 md:w-[0.25vw]  bg-theme-cyan transform -translate-x-1/2 md:block xs:hidden"
      ></motion.div>

      <div className="flex flex-col xs:items-center md:items-start md:gap-[2vw] sm:gap-[3vw] xs:gap-[4vw]">
        {experiences?.map((item, idx) => {
          const startedAt = new Date(item?.startedAt).toLocaleDateString()
          const endDate = new Date(item?.endDate).toLocaleDateString()
          return (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: '0 0 10px #06b5d46c, 0 0 20px #06b5d463, 0 0 30px #06b5d442',
              }}
              transition={{ duration: 0.3 }}
              className={`relative  md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] md:w-[45%] sm:w-[80%] xs:w-[90%] gradient-button ${
                idx % 2 === 0
                  ? 'md:self-start md:ml-0 sm:ml-[10%]'
                  : 'md:self-end md:mr-0 sm:mr-[10%]'
              }`}
            >
              {/* Dot on line */}
              <span
                className={`absolute md:block xs:hidden top-[50%] w-[1vw] h-[1vw] sm:w-[1.5vw] sm:h-[1.5vw] xs:w-[2vw] xs:h-[2vw] bg-theme-cyan rounded-full transform -translate-y-1/2 ${
                  idx % 2 === 0
                    ? 'md:right-[-0.7vw] sm:right-[-1vw]'
                    : 'md:left-[-0.7vw] sm:left-[-1vw]'
                }`}
              ></span>
              <div className="w-full h-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] bg-theme-dark md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] flex flex-col md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[2.5vw]">
                <h2 className="md:text-[1.6vw] sm:text-[2.6vw] xs:text-[4.6vw] md:leading-[2.1vw] sm:leading-[3.1vw] xs:leading-[5.1vw] font-semibold font-fira-code text-theme-cyan">
                  {item?.position}
                </h2>
                <p className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] text-gray-400">
                  {startedAt} - {endDate}
                </p>
                <p className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] text-gray-400">
                  {item.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default ExperienceTimeline
