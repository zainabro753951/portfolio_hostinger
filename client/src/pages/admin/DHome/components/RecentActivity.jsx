import React from 'react'
import { motion } from 'motion/react'
import { useSelector } from 'react-redux'
import { RecentActivitySkeleton } from './RecentActivitySkeleton'

import { TimeAgo } from '../../../../components/TimeAgo'

const container = {
  hidden: { opacity: 0, y: 1.5 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 1.2 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const typeMeta = {
  Project: { color: 'bg-blue-600/90', icon: '📁' },
  Update: { color: 'bg-yellow-500/90', icon: '✏️' },
  Message: { color: 'bg-green-600/90', icon: '✉️' },
  Delete: { color: 'bg-red-600/90', icon: '🗑️' },
}

const getMetaByKeyword = (type = '') => {
  const lowerType = type.toLowerCase()

  return Object.entries(typeMeta).find(([key]) => lowerType.includes(key.toLowerCase()))?.[1]
}

const defaultActivities = [
  {
    id: 'a1',
    type: 'Project',
    title: 'E‑commerce UI published',
    description: 'Published new e‑commerce project with cart & checkout flows.',
    author: 'You',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'a2',
    type: 'Update',
    title: 'Landing page draft created',
    description: 'Draft for marketing landing page created (needs review).',
    author: 'You',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3.5).toISOString(),
  },
  {
    id: 'a3',
    type: 'Message',
    title: 'New message from Ali Khan',
    description: 'Ali asks about a custom pricing card for his site.',
    author: 'Ali Khan',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'a4',
    type: 'Project',
    title: 'Portfolio project updated',
    description: 'Updated screenshots and SEO meta for the Blog project.',
    author: 'You',
    time: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'a5',
    type: 'Delete',
    title: 'Old prototype removed',
    description: 'Removed an old prototype to declutter the projects list.',
    author: 'You',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
]

const RecentActivity = () => {
  const { activities, isLoading } = useSelector(state => state.activities)

  const total = defaultActivities.length

  if (isLoading) {
    return <RecentActivitySkeleton />
  }

  return (
    <motion.aside
      initial="hidden"
      animate="show"
      variants={container}
      className="w-full max-w-[90vw] md:max-w-[50vw] p-[2vw] md:p-[1.5vw] rounded-[1.5vw] bg-linear-to-br from-[#0b0b2a]/60 to-[#0f1040]/30 border border-white/10 backdrop-blur-[2vw] shadow-lg"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-[1.5vw]">
        <div>
          <h3 className="text-white text-[1.5vw] md:text-[1.2vw] font-semibold flex items-center gap-[0.5vw]">
            <span className="inline-flex items-center justify-center w-[2vw] h-[2vw] rounded-[0.5vw] bg-white/6 text-[0.9vw]">
              🔔
            </span>
            <span>Recent Activity</span>
          </h3>
          <p className="text-gray-300 text-[1vw] md:text-[0.8vw] mt-[0.5vw]">
            Latest actions on your portfolio — {total} items
          </p>
        </div>
        <button
          className="mt-[1vw] md:mt-0 px-[1vw] py-[0.5vw] text-[0.8vw] md:text-[0.7vw] rounded-[0.5vw] bg-white/6 hover:bg-white/8 transition"
          onClick={() => console.log('View all clicked')}
        >
          View all
        </button>
      </header>

      <motion.ul
        className="flex flex-col gap-[1vw] overflow-auto max-h-[50vh] py-[0.5vw] custom-scrollbar overflow-x-hidden"
        variants={container}
      >
        {activities.map(act => {
          const meta = getMetaByKeyword(act.activity_type) || {
            color: 'bg-gray-600/80',
            icon: 'ℹ️',
          }
          return (
            <motion.li
              key={act.id}
              variants={item}
              className="flex items-start gap-[1vw] p-[1vw] rounded-[1vw] hover:bg-white/3 transition cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div
                className={`flex-none w-[3vw] h-[3vw] rounded-[0.8vw] flex items-center justify-center ${meta.color}`}
              >
                <span className="text-white text-[1.2vw]">{meta.icon}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-[0.5vw]">
                  <h4 className="text-white text-[1vw] md:text-[0.9vw] font-medium truncate">
                    {act.activity_title}
                  </h4>
                  <time className="text-gray-400 text-[0.8vw] md:text-[0.7vw]">
                    {<TimeAgo time={act.created_at} />}
                  </time>
                </div>
                <p className="text-gray-300 text-[0.9vw] md:text-[0.8vw] mt-[0.5vw] truncate">
                  {act.activity_description}
                </p>
                <div className="mt-[0.5vw] flex items-center gap-[0.5vw]">
                  <span className="text-gray-400 text-[0.8vw]">by you</span>
                  <span className="ml-[0.5vw] inline-flex items-center gap-[0.3vw] text-[0.7vw] text-gray-400 px-[0.5vw] py-[0.2vw] rounded-[0.5vw] bg-white/3">
                    <strong className="text-[0.65vw]">{act.activity_type}</strong>
                  </span>
                </div>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>

      <footer className="mt-[1vw] flex items-center justify-between">
        <small className="text-gray-400 text-[0.8vw]">Auto-synced — shows last 50 activities</small>
        <button className="text-[0.8vw] px-[1vw] py-[0.5vw] rounded-[0.5vw] bg-white/6 hover:bg-white/8 transition">
          Refresh
        </button>
      </footer>
    </motion.aside>
  )
}

export default RecentActivity
