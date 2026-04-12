import React, { memo } from "react";
import { NavLink } from "react-router-dom";
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
} from "react-icons/fa6";
import { FiHelpCircle } from "react-icons/fi";
import { FaTools } from "react-icons/fa";
import { motion } from "motion/react";
import { MdHomeRepairService } from "react-icons/md";

// Memoized nav item for better performance
const NavItem = memo(({ item, index }) => {
  return (
    <motion.div
      key={item.path}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.04,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
      }}
      className="w-full"
    >
      <NavLink
        to={item.path}
        end={item.path === "/admin"}
        className={({ isActive }) =>
          `group flex items-center gap-3 px-4 py-3 rounded-xl 
           transition-all duration-300 ease-out
           will-change-transform transform-gpu
           hover:scale-[1.02] active:scale-[0.98]
           ${
             isActive
               ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-indigo-500/10 " +
                 "text-cyan-50 border border-cyan-400/30 " +
                 "shadow-[0_4px_20px_-4px_rgba(34,211,238,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] " +
                 "backdrop-blur-sm"
               : "text-slate-400 border border-transparent " +
                 "hover:bg-white/[0.04] hover:text-slate-200 " +
                 "hover:border-white/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
           }`
        }
      >
        <span
          className={`
            flex-shrink-0 text-lg transition-all duration-300
            group-hover:scale-110 group-hover:rotate-3
          `}
        >
          {item.icon}
        </span>
        <span className="text-sm font-medium tracking-wide whitespace-nowrap hidden md:block">
          {item.name}
        </span>

        {/* Active indicator dot */}
        <motion.div
          className="hidden md:block ml-auto"
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`
              w-1.5 h-1.5 rounded-full transition-all duration-300
              ${item.isActive ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-transparent"}
            `}
          />
        </motion.div>
      </NavLink>
    </motion.div>
  );
});

NavItem.displayName = "NavItem";

const Nav = () => {
  const navLinks = [
    { name: "Overview", icon: <FaChartPie />, path: "/admin" },
    { name: "Projects", icon: <FaFolderOpen />, path: "projects" },
    { name: "Add Project", icon: <FaSquarePlus />, path: "add-project" },
    { name: "About", icon: <FaCircleInfo />, path: "about" },
    { name: "Skills", icon: <FaTools />, path: "skills" },
    { name: "Education", icon: <FaGraduationCap />, path: "education" },
    { name: "Experience", icon: <FaBriefcase />, path: "experience" },
    { name: "Services", icon: <MdHomeRepairService />, path: "services" },
    { name: "FAQs", icon: <FiHelpCircle />, path: "faqs" },
    { name: "Testimonials", icon: <FaComments />, path: "testimonials" },
    { name: "Pricing Plans", icon: <FaMoneyBillWave />, path: "pricing-plan" },
    { name: "User Messages", icon: <FaMessage />, path: "user-messages" },
    { name: "Users & Roles", icon: <FaUserShield />, path: "users-roles" },
    { name: "Site Settings", icon: <FaSliders />, path: "site-settings" },
    { name: "Analytics", icon: <FaChartLine />, path: "analytics" },
    { name: "Help / Docs", icon: <FaBookOpen />, path: "help-docs" },
  ];

  return (
    <nav className="flex flex-col gap-2 py-6 px-3 w-full h-full overflow-y-auto scrollbar-hide">
      {/* Logo/Brand Area */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 px-4 hidden md:block"
      >
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
      </motion.div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-1">
        {navLinks.map((item, idx) => (
          <NavItem key={item.path} item={item} index={idx} />
        ))}
      </div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="mt-auto pt-6 px-4 hidden md:block"
      >
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5">
          <p className="text-xs text-slate-400 text-center">Version 2.0</p>
        </div>
      </motion.div>
    </nav>
  );
};

export default memo(Nav);
