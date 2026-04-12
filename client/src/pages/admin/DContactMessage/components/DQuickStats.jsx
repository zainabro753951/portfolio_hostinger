import React, { memo } from "react";
import { motion } from "motion/react";
import { BarChart3, Bell, Mail, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

const DQuickStats = () => {
  const { allMsgsCount, newMessagesCount, unreadMessagesCount } = useSelector(
    (state) => state.contactMessages,
  );

  const quickStats = [
    {
      label: "Total Messages",
      value: allMsgsCount || 0,
      icon: BarChart3,
      color: "from-cyan-500/20 to-blue-500/20",
      textColor: "text-cyan-400",
    },
    {
      label: "New Messages",
      value: newMessagesCount || 0,
      icon: Bell,
      color: "from-emerald-500/20 to-green-500/20",
      textColor: "text-emerald-400",
    },
    {
      label: "Unread Messages",
      value: unreadMessagesCount || 0,
      icon: Mail,
      color: "from-amber-500/20 to-orange-500/20",
      textColor: "text-amber-400",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative overflow-hidden
                p-5 sm:p-6 rounded-2xl
                bg-gradient-to-br ${stat.color}
                border border-white/10
                backdrop-blur-xl
                shadow-lg shadow-black/20
                hover:shadow-xl hover:shadow-cyan-500/10
                transition-all duration-300
                cursor-pointer
                group
              `}
            >
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-white">
                    {stat.value.toLocaleString()}
                  </p>
                </div>

                {/* Icon */}
                <div
                  className={`
                  w-12 h-12 sm:w-14 sm:h-14 rounded-xl
                  bg-gradient-to-br from-white/10 to-white/5
                  border border-white/10
                  flex items-center justify-center
                  ${stat.textColor}
                  group-hover:scale-110 transition-transform duration-300
                `}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div
                className={`
                absolute bottom-0 left-0 right-0 h-1
                bg-gradient-to-r ${stat.color.replace("/20", "/50")}
                rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
              `}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default memo(DQuickStats);
