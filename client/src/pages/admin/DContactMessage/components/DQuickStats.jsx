import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Bell, Mail } from 'lucide-react'
import { useSelector } from 'react-redux'

const glassClass = `
  md:p-[1.5vw] sm:p-[2vw] xs:p-[3vw]
  md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
  bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
  border border-white/20 backdrop-blur-2xl
  shadow-[0_0_25px_rgba(34,211,238,0.15)]
  w-full flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]
`

const DQuickStats = () => {
  const { allMsgsCount, newMessagesCount, unreadMessagesCount } = useSelector(
    state => state.contactMessages
  )
  const quickStats = [
    {
      label: 'total',
      value: allMsgsCount,
      icon: <BarChart3 className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]" />,
    },
    {
      label: 'new',
      value: newMessagesCount,
      icon: <Bell className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]" />,
    },
    {
      label: 'unread',
      value: unreadMessagesCount,
      icon: <Mail className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]" />,
    },
  ]

  return (
    <div className={glassClass}>
      <div className="w-full grid md:grid-cols-3 xs:grid-cols-1  md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
        {quickStats.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center
             md:p-[1.5vw] sm:p-[2.2vw] xs:p-[3vw]
             border border-cyan-400/20
             md:rounded-[0.8vw] sm:rounded-[1.2vw] xs:rounded-[2vw]
             bg-gradient-to-br from-white/10 to-white/5
             backdrop-blur-lg
             shadow-[0_0_15px_rgba(0,0,0,0.25)]
             hover:from-white/20 hover:to-white/10
             hover:border-cyan-400/40
             text-center"
          >
            <div className="text-cyan-300 mb-[0.4vw]">{stat.icon}</div>
            <p className="md:text-[1vw] sm:text-[2vw] xs:text-[4vw] capitalize text-gray-300">
              {stat.label}
            </p>
            <p className="md:text-[1.6vw] sm:text-[2.8vw] xs:text-[4.6vw] font-bold text-white">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default DQuickStats
