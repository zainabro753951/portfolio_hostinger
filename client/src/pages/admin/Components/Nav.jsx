import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaChartPie,
  FaFolderOpen,
  FaSquarePlus,
  FaCircleInfo,
  FaGraduationCap,
  FaComments,
  FaMoneyBillWave,
  FaUserShield,
  FaSliders,
  FaChartLine,
  FaBookOpen,
  FaMessage,
  FaBriefcase,
} from 'react-icons/fa6'
import { FiHelpCircle } from 'react-icons/fi'
import { FaTools } from 'react-icons/fa'
import { motion } from 'motion/react'
import { MdHomeRepairService } from 'react-icons/md'
MdHomeRepairService

const Nav = () => {
  const navLinks = [
    { name: 'Overview', icon: <FaChartPie />, path: '/admin' },
    { name: 'Projects', icon: <FaFolderOpen />, path: 'projects' },
    { name: 'Add Project', icon: <FaSquarePlus />, path: 'add-project' },
    { name: 'About', icon: <FaCircleInfo />, path: 'about' },
    { name: 'Skills', icon: <FaTools />, path: 'skills' },
    { name: 'Education', icon: <FaGraduationCap />, path: 'education' },
    { name: 'Experience', icon: <FaBriefcase />, path: 'experience' },
    { name: 'Services', icon: <MdHomeRepairService />, path: 'services' },
    { name: 'FAQs', icon: <FiHelpCircle />, path: 'faqs' },
    { name: 'Testimonials', icon: <FaComments />, path: 'testimonials' },
    { name: 'Pricing Plans', icon: <FaMoneyBillWave />, path: 'pricing-plan' },
    { name: 'User Messages', icon: <FaMessage />, path: 'user-messages' },
    { name: 'Users & Roles', icon: <FaUserShield />, path: 'users-roles' },
    { name: 'Site Settings', icon: <FaSliders />, path: 'site-settings' },
    { name: 'Analytics', icon: <FaChartLine />, path: 'analytics' },
    { name: 'Help / Docs', icon: <FaBookOpen />, path: 'help-docs' },
  ]

  return (
    <nav className="flex flex-col xs:items-center md:items-start gap-[0.6vw] md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] w-full">
      {navLinks.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="w-full"
        >
          <NavLink
            to={item.path}
            end={item.path === '/admin'} // ✅ only exact match for overview
            className={({ isActive }) =>
              `flex xs:justify-center md:justify-start items-center md:gap-[0.8vw] md:p-[0.9vw] sm:p-[2.5vw] xs:p-[3.5vw] md:rounded-[0.8vw] w-full sm:rounded-[1.3vw] xs:rounded-[1.8vw] transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  : 'hover:bg-white/5 text-gray-300 border border-transparent hover:border-white/10'
              }`
            }
          >
            <span className="text-cyan-400 md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw]">
              {item.icon}
            </span>
            <span className="md:text-[1.05vw] sm:text-[2vw] xs:text-[3.5vw] font-medium tracking-wide md:block xs:hidden">
              {item.name}
            </span>
          </NavLink>
        </motion.div>
      ))}
    </nav>
  )
}

export default Nav
