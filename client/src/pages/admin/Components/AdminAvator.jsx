import React from 'react'
import { motion } from 'motion/react'

const AdminAvatar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] bg-white/5 backdrop-blur-md border border-white/10 md:p-[1vw] sm:p-[2vw] xs:p-[3vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full"
    >
      {/* Avatar Circle */}
      <motion.div
        whileHover={{ rotate: 10, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="md:w-[3.5vw] md:h-[3.5vw] sm:w-[5vw] sm:h-[5vw] xs:w-[7vw] xs:h-[7vw] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.4)] overflow-hidden"
      >
        <img
          src="https://images.saymedia-content.com/.image/t_share/MTk4OTEyNDE2Mzg0Mjk2Mjk5/songs-about-men.jpg"
          className="w-full h-full object-cover object-center"
          alt=""
        />
      </motion.div>

      {/* Info */}
      <div className="md:block xs:hidden">
        <h1 className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] font-semibold text-white">
          Zain Abro
        </h1>
        <p className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">
          Portfolio Admin
        </p>
      </div>
    </motion.div>
  )
}

export default AdminAvatar
