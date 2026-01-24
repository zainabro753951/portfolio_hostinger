import React, { useEffect } from 'react'
import Sidebar from '../Components/Sidebar'
import { motion } from 'motion/react'
import Header from '../Components/Header'
import DHomeCards from '../DHome/components/DHomeCards'
import { Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import DeleteConfirm from '../Components/DeleteConfirm'
import { useDeleteEntryContext } from '../../../context/DeleteEntry'

const DHomePage = () => {
  const location = useLocation()
  const isDashboard = location.pathname === '/admin'

  return (
    <div className="w-full h-screen font-inter bg-gradient-to-br from-[#0b1120] via-[#0f1e3a] to-[#111827] relative overflow-hidden text-white">
      {/* 🔵 Animated Glass Blobs for depth */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute -top-32 -left-32 w-[35vw] h-[35vw] bg-cyan-500/30 blur-[100px] rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
        className="absolute -bottom-32 -right-32 w-[35vw] h-[35vw] bg-indigo-500/30 blur-[100px] rounded-full"
      />

      {/* 🌫 Main Layout */}
      <div className="relative w-full h-full flex items-stretch">
        <Sidebar />
        <ToastContainer />

        {/* 🔹 Dashboard Content Area */}
        <main className="flex-1 backdrop-blur-md bg-white/5 border-l border-white/10 overflow-y-auto custom-scrollbar ">
          {/* Header */}
          <div className="relative z-[9999]">
            <Header />
          </div>
          {/* Cards */}
          {/* 👇 Agar /admin pe ho to cards dikhao, warna nested page */}
          {isDashboard ? <DHomeCards /> : <Outlet />}
        </main>
        <DeleteConfirm />
      </div>
    </div>
  )
}

export default DHomePage
