import React from 'react'
import { motion } from 'motion/react'

import AdminAvator from './AdminAvator'
import Nav from './Nav'

const Sidebar = () => {
  return (
    <motion.aside
      transition={{ duration: 0.6 }}
      className="md:w-[23%] backdrop-blur-2xl bg-white/10 border-r border-white/10 md:p-[1vw] sm:p-[1.5vw] xs:p-[2vw] flex flex-col xs:items-center justify-between overflow-auto custom-scrollbar md:items-start"
    >
      {/* Admin Avator */}
      <AdminAvator />

      {/* Nav Bar */}
      <Nav />

      {/* Logged in Information */}
      <div className="md:w-full md:block xs:hidden">
        <p className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">
          Logged in as Zain
        </p>
        <p className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">Settings</p>
        <p className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400">Logout</p>
      </div>
    </motion.aside>
  )
}

export default Sidebar
