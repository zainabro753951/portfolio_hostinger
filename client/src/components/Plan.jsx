import React from 'react'
import { motion } from 'motion/react'
import GardientButton from './GardientButton'

const Plan = ({ item, isInContact = false }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: 'easeOut', duration: 0.6 },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { ease: 'easeOut', duration: 0.5 },
    },
  }
  return (
    <motion.div
      variants={cardVariants}
      initial={'hidden'}
      animate={'show'}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 0 10px #06b5d46c, 0 0 20px #06b5d463, 0 0 30px #06b5d442',
      }}
      transition={{ duration: 0.3 }}
      className="md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] relative gradient-button"
    >
      <div className="w-full h-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] bg-theme-dark md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] flex flex-col md:gap-[0.5vw] sm:gap-[1vw] xs:gap-[1.5vw]">
        <h2 className="md:text-[1.5vw] sm:text-[2.5vw] xs:text-[4.5vw] font-fira-code font-semibold capitalize">
          {item?.planName}
          {/* <span className="gradient-text">{item.tag}</span> */}
        </h2>
        <h3 className="md:text-[2.5vw] sm:text-[3.5vw] xs:text-[5.5vw] font-bold text-theme-cyan pb-1">
          {item?.price}
          {item?.currency}/{item?.billingCycle}
        </h3>
        <p className="md:text-[1.15vw] sm:text-[2.15vw] xs:text-[4.15vw] text-gray-400 md:pb-[1vw] sm:pb-[1.5vw] xs:pb-[2vw]">
          {item?.shortDesc}
        </p>

        <div className="w-full h-full flex flex-col justify-between">
          <ul className="w-full flex flex-col md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw] text-gray-300 list-tick">
            {item?.featurePoints?.map((pt, i) => (
              <li
                key={i}
                className="relative md:pl-[2vw] sm:pl-[3vw] xs:pl-[4vw] md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]"
              >
                {pt?.name}
              </li>
            ))}
          </ul>

          {!isInContact ? (
            <motion.div
              variants={buttonVariants}
              className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] flex flex-col w-full"
            >
              <GardientButton text="Choose Plan" link={`/contact/${item?.id}`} />
            </motion.div>
          ) : (
            ''
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Plan
