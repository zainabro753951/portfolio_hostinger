import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Bell, Plus, Search, ChevronDown } from "lucide-react";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const notifications = [
    {
      id: 1,
      text: "New project added successfully",
      time: "2m ago",
      type: "success",
    },
    { id: 2, text: "Profile updated", time: "10m ago", type: "info" },
    {
      id: 3,
      text: "New visitor on portfolio",
      time: "25m ago",
      type: "visitor",
    },
  ];

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = useCallback(() => {
    setShowNotifications((prev) => !prev);
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return "bg-emerald-500/20 text-emerald-400";
      case "visitor":
        return "bg-violet-500/20 text-violet-400";
      default:
        return "bg-cyan-500/20 text-cyan-400";
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="show"
      className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-slate-900/80 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Title */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Portfolio Dashboard
          </h2>
          <p className="hidden sm:block text-slate-400 text-sm mt-0.5">
            Manage content — projects, about, skills & more
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3 sm:gap-4" ref={notificationRef}>
          {/* Search Input - Hidden on mobile */}
          <div className="hidden xl:flex items-center relative group">
            <Search className="absolute left-3 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="search"
              className="w-64 pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-sm"
              placeholder="Search projects..."
            />
          </div>

          {/* New Project Button - Hidden on small mobile */}
          <motion.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:block">New Project</span>
          </motion.button>

          {/* Notification Bell */}
          <motion.button
            whileHover={prefersReducedMotion ? {} : { rotate: 10, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleNotifications}
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            {/* Notification Badge */}
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-900 animate-pulse" />
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
              >
                {/* Dropdown Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    Notifications
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-medium">
                    {notifications.length} new
                  </span>
                </div>

                {/* Notifications List */}
                {notifications.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto custom-scrollbar">
                    {notifications.map((n, index) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex items-start gap-3 px-5 py-3.5 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationIcon(n.type).split(" ")[0].replace("bg-", "bg-").replace("/20", "")}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
                            {n.text}
                          </p>
                          <p className="text-slate-500 text-xs mt-1">
                            {n.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center">
                    <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">
                      No new notifications
                    </p>
                  </div>
                )}

                {/* Dropdown Footer */}
                <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02]">
                  <button className="w-full text-center text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Avatar */}
          <motion.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-cyan-500/50 transition-all duration-300"
          >
            <img
              src="https://images.saymedia-content.com/.image/t_share/MTk4OTEyNDE2Mzg0Mjk2Mjk5/songs-about-men.jpg"
              className="w-full h-full object-cover"
              alt="User Avatar"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default memo(Header);
