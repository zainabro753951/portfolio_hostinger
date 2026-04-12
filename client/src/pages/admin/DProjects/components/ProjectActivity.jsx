import React, { memo, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Pencil, Trash2, CheckCircle2, Clock, Activity } from "lucide-react";

const ActivityItem = memo(({ item, index, prefersReducedMotion }) => {
  const getIconAndColor = () => {
    switch (item.type) {
      case "update":
        return {
          icon: <Pencil className="w-4 h-4" />,
          color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        };
      case "publish":
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "delete":
        return {
          icon: <Trash2 className="w-4 h-4" />,
          color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        };
      default:
        return {
          icon: <Activity className="w-4 h-4" />,
          color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        };
    }
  };

  const { icon, color } = getIconAndColor();

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -20, y: 10 },
      show: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: index * 0.1,
        },
      },
    }),
    [index],
  );

  const hoverAnimation = prefersReducedMotion
    ? {}
    : {
        x: 4,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        transition: { duration: 0.2 },
      };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      whileHover={hoverAnimation}
      className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center border ${color} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
        <p className="text-white text-sm font-medium truncate group-hover:text-cyan-400 transition-colors duration-300">
          {item.action}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-slate-500 text-xs flex-shrink-0 ml-4">
        <Clock className="w-3.5 h-3.5" />
        <span>{item.time}</span>
      </div>
    </motion.div>
  );
});

ActivityItem.displayName = "ActivityItem";

const ProjectActivity = () => {
  const prefersReducedMotion = useReducedMotion();

  const activities = useMemo(
    () => [
      { type: "update", action: "Updated portfolio design", time: "2h ago" },
      {
        type: "publish",
        action: "Published new E-Commerce UI",
        time: "5h ago",
      },
      { type: "delete", action: "Deleted old landing page", time: "1d ago" },
    ],
    [],
  );

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.1,
          delayChildren: 0.1,
        },
      },
    }),
    [],
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-white/5 bg-white/[0.02]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-white text-lg font-bold tracking-tight">
            Recent Activity
          </h4>
          <p className="text-slate-500 text-xs">
            Latest actions on your projects
          </p>
        </div>
      </div>

      {/* Activity List */}
      <div className="p-4 flex flex-col gap-2">
        {activities.map((item, index) => (
          <ActivityItem
            key={index}
            item={item}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02]">
        <button className="w-full text-center text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium py-2 rounded-lg hover:bg-white/5">
          View all activity
        </button>
      </div>
    </motion.div>
  );
};

export default memo(ProjectActivity);
