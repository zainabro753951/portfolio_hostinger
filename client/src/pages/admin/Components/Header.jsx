import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MdOutlineNotificationsNone } from 'react-icons/md'

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, text: 'New project added successfully', time: '2m ago' },
    { id: 2, text: 'Profile updated', time: '10m ago' },
    { id: 3, text: 'New visitor on portfolio', time: '25m ago' },
  ]

  return (
    <div className="relative md:py-[0.5vw] sm:py-[1.5vw] xs:py-[2.5vw] w-full flex items-center justify-between backdrop-blur-xl bg-white/10 border-b border-white/10 md:px-[1vw] sm:px-[1.5vw] xs:px-[2vw]">
      {/* Left side */}
      <div>
        <h2 className="md:text-[1.4vw] sm:text-[2.4vw] xs:text-[4.4vw] font-semibold text-theme-cyan ">
          Portfolio - Dashboard
        </h2>
        <p className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400 sm:block xs:hidden">
          Manage content — projects, about, skills & more
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center md:gap-[1vw] sm:gap-[1.5vw] xs:gap-[2vw] relative">
        <input
          type="search"
          className="md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw]  md:px-[1vw] sm:px-[1.5vw] xs:px-[2vw]  outline-none bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)] rounded-full md:text-[1vw] sm:text-[2vw] xs:text-[4vw] md:block xs:hidden"
          placeholder="Search here"
        />

        {/* New Project button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[4.5vw] bg-gradient-to-r from-cyan-500 to-blue-500 text-cyan-100 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.25)] rounded-full md:text-[1vw] sm:text-[2vw] xs:text-[4vw] md:block xs:hidden"
        >
          New Project
        </motion.button>

        {/* Notification icon */}
        <motion.div className="relative cursor-pointer rounded-full md:text-[2vw] sm:text-[3vw] xs:text-[4vw] text-cyan-300">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => setShowNotifications(prev => !prev)}
          >
            <MdOutlineNotificationsNone />
            <div className="w-1 h-1 rounded-full bg-cyan-400 absolute right-[0.3vw] top-[0.3vw] animate-pulse"></div>
          </motion.div>

          {/* Notification dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 md:mt-[1vw] sm:mt-[2vw] xs:mt-[3vw] md:w-[40vw] sm:w-[50vw] xs:w-[65vw] bg-gradient-to-br from-[#0a0a2a]/90 to-[#001122]/90 border border-cyan-500/20 md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw] shadow-lg backdrop-blur-xl overflow-hidden z-50"
              >
                <div className="md:p-[1vw] sm:p-[2vw] xs:p-[3vw] text-cyan-300 font-semibold border-b border-cyan-400/10 md:text-[1.5vw] sm:text-[2.5vw] xs:text-[4.5vw]">
                  Notifications
                </div>
                {notifications.length > 0 ? (
                  <div className="md:max-h-[15vw] sm:max-h-[40vw] xs:max-h-[50vw] overflow-y-auto w-full ">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className="md:px-[1vw] sm:px-[2vw] xs:px-[3vw] md:py-[0.6vw] sm:py-[1.1vw] xs:py-[1.6vw]  hover:bg-white/5 transition flex justify-between text-sm text-gray-300 md:text-[1.1vw] sm:text-[2.1vw] xs:text-[3.1vw] w-full "
                      >
                        <span>{n.text}</span>
                        <span className="text-gray-500 ">{n.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-[1vw] text-gray-400 text-sm">No new notifications</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Profile Image */}
        <motion.div
          whileHover={{ rotate: 10, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="md:w-[2.7vw] md:h-[2.7vw] sm:w-[5vw] sm:h-[5vw] xs:w-[7vw] xs:h-[7vw] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.4)] overflow-hidden"
        >
          <img
            src="https://images.saymedia-content.com/.image/t_share/MTk4OTEyNDE2Mzg0Mjk2Mjk5/songs-about-men.jpg"
            className="w-full h-full object-cover object-center"
            alt="User Avatar"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default Header
