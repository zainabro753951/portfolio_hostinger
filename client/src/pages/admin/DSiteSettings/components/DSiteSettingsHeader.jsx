import { motion } from 'motion/react'
import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'

const DSiteSettingsHeader = ({ handleReset, isPending }) => {
  return (
    <div className="w-full flex items-center justify-between flex-wrap md:gap-0 sm:gap-[2vw] xs:gap-[3vw]">
      {/* Project Info */}
      <div>
        <h3 className="md:text-[1.5vw] sm:text-[2.5vw] xs:text-[4.5vw] font-semibold">
          Site Settings
        </h3>
        <p className="md:text-[1vw] sm:text-[2vw] xs:text-[4vw] text-gray-400">
          Manage all your site settings
        </p>
      </div>
      {/* Project Sorting */}
      <div className="flex md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] items-center">
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200 }}
          onClick={handleReset}
          className="md:py-[0.7vw] sm:py-[1.2vw] xs:py-[1.7vw] md:px-[2.5vw] sm:px-[3.5vw] xs:px-[4.5vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] bg-white/6 border border-white/8 text-white hover:bg-white/8  md:text-[1vw] sm:text-[2vw] xs:text-[4vw]"
        >
          Reset
        </motion.button>
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
            'Save Changes'
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default DSiteSettingsHeader
