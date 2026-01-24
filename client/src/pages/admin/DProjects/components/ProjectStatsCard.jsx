import React from 'react'
import { FaFolderOpen, FaCheckCircle, FaRegClock } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const ProjectStatsCards = () => {
  const { projectCounts } = useSelector(state => state.projects)

  const stats = [
    {
      icon: <FaFolderOpen className="text-cyan-400" />,
      label: 'Total Projects',
      value: projectCounts?.allProjects,
      color: 'from-cyan-500/20 to-blue-500/20',
    },
    {
      icon: <FaCheckCircle className="text-emerald-400" />,
      label: 'Published',
      value: projectCounts?.publishedProjects,
      color: 'from-emerald-500/20 to-green-500/20',
    },
    {
      icon: <FaRegClock className="text-yellow-400" />,
      label: 'Drafts',
      value: projectCounts?.draftProjects,
      color: 'from-yellow-500/20 to-orange-500/20',
    },
  ]

  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 md:gap-[2vw] sm:gap-[3vw] xs:gap-[4vw] md:mb-[2vw] sm:mb-[3vw] xs:mb-[4vw]">
      {stats.map((item, i) => (
        <div
          key={i}
          className={`flex items-center justify-between md:p-[1.5vw] sm:p-[2.5vw] xs:p-[3.5vw] md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[3vw]
          border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.15)]
          bg-gradient-to-br ${item.color} backdrop-blur-xl
          transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="md:text-[2.5vw] sm:text-[3.5vw] xs:text-[5.5vw]">{item.icon}</div>
          <div className="text-right">
            <h3 className="md:text-[2vw] sm:text-[3vw] xs:text-[5vw] font-semibold text-cyan-100">
              {item.value}
            </h3>
            <p className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] text-cyan-300/80">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProjectStatsCards
