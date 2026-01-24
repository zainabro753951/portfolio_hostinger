import React from 'react'
import { motion } from 'motion/react'
import { ThreeCircles } from 'react-loader-spinner'

const DAddProjectHeader = ({ isPending }) => {
  // framer variants
  const fadeIn = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.45 } },
  }

  return (
    <motion.header
      variants={fadeIn}
      className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] md:mb-[1.5vw] sm:mb-[2.5vw] xs:mb-[3.5vw] "
    >
      <div>
        <h1 className="md:text-[1.5vw] sm:text-[2.5vw] xs:text-[4.5vw] font-semibold">
          Add / Edit Project
        </h1>
        <p className="md:text-[1vw] sm:text-[2vw] xs:text-[4vw] text-gray-400 ">
          Create or update project details, SEO and assets.
        </p>
      </div>
      <div className="flex md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200 }}
          whileTap={{ scale: 0.98 }}
          className="md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw] bg-gradient-to-r from-cyan-500 to-blue-500 text-cyan-100 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.25)] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] md:text-[1vw] sm:text-[2vw] xs:text-[4vw] flex items-center justify-center"
          title={isPending ? 'Loading...' : ''}
          type={isPending ? 'button' : 'submit'}
        >
          {isPending ? (
            <ThreeCircles
              visible={true}
              color="#ff657c"
              width={20}
              height={20}
              ariaLabel="three-circles-loading"
            />
          ) : (
            'Publish'
          )}
        </motion.button>
      </div>
    </motion.header>
  )
}

export default DAddProjectHeader
