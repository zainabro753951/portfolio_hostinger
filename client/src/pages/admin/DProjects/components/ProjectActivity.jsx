import React from 'react'
import { FaPenFancy, FaTrash, FaCheck } from 'react-icons/fa'

const ProjectActivity = () => {
  const activities = [
    { icon: <FaPenFancy />, action: 'Updated portfolio design', time: '2h ago' },
    { icon: <FaCheck />, action: 'Published new E-Commerce UI', time: '5h ago' },
    { icon: <FaTrash />, action: 'Deleted old landing page', time: '1d ago' },
  ]

  return (
    <div
      className="w-full md:mt-[2vw] sm:mt-[3vw] xs:mt-[4vw] md:p-[1.5vw] sm:p-[2.5vw] xs:p-[3.5vw] md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      border border-cyan-400/20 bg-gradient-to-br from-[#0a0a2a]/50 to-[#101040]/30
      backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.15)]"
    >
      <h4 className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] font-semibold md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw] text-theme-cyan">
        Recent Activity
      </h4>
      <div className="flex flex-col md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
        {activities.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between md:p-[1vw] sm:p-[2vw] xs:p-[3vw] md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw] bg-white/5
              border border-white/10 hover:bg-cyan-500/10 transition-all duration-300 "
          >
            <div className="flex items-center md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] text-white">
              <span className="md:text-[1.5vw] sm:text-[2.5vw] xs:text-[4.5vw]">{item.icon}</span>
              <p className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw]">{item.action}</p>
            </div>
            <p className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-400">
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectActivity
