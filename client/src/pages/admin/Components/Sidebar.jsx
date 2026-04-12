import React, { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Settings, LogOut, User } from "lucide-react";
import AdminAvator from "./AdminAvator";
import Nav from "./Nav";

const Sidebar = () => {
  const prefersReducedMotion = useReducedMotion();

  const sidebarVariants = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="show"
      className="w-full md:w-64 lg:w-72 h-screen backdrop-blur-2xl bg-slate-900/80 border-r border-white/10 flex flex-col overflow-y-auto custom-scrollbar"
    >
      {/* Admin Avatar Section */}
      <motion.div
        variants={itemVariants}
        className="md:p-6 p-3 border-b border-white/5"
      >
        <AdminAvator />
      </motion.div>

      {/* Navigation Section */}
      <motion.nav variants={itemVariants} className="flex-1 md:p-4">
        <Nav />
      </motion.nav>

      {/* Footer - Logged in Information */}
      <motion.div
        variants={itemVariants}
        className="p-6 border-t border-white/5 bg-white/[0.02] hidden md:block"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">Zain</p>
            <p className="text-slate-500 text-xs">Administrator</p>
          </div>
        </div>

        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 group">
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm font-medium">Settings</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Mobile Footer - Only visible on small screens */}
      <motion.div
        variants={itemVariants}
        className="p-4 border-t border-white/5 md:hidden flex flex-col items-center gap-3"
      >
        <div className="flex flex-col gap-4">
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default memo(Sidebar);
