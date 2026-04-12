import React, { memo, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useSelector } from "react-redux";
import { RecentActivitySkeleton } from "./RecentActivitySkeleton";
import { TimeAgo } from "../../../../components/TimeAgo";
import { Bell, RefreshCw, ChevronRight } from "lucide-react";

// Memoized activity item component for better performance
const ActivityItem = memo(({ act, meta, index, prefersReducedMotion }) => {
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
          delay: index * 0.08,
        },
      },
    }),
    [index],
  );

  const hoverAnimation = prefersReducedMotion
    ? {}
    : {
        x: 4,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        transition: { duration: 0.2 },
      };

  return (
    <motion.li
      variants={itemVariants}
      initial="hidden"
      animate="show"
      whileHover={hoverAnimation}
      className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all duration-300 cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`${act.activity_title} - ${act.activity_type}`}
    >
      {/* Icon Container */}
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-lg ${meta.color} backdrop-blur-sm`}
      >
        <span className="text-white drop-shadow-sm">{meta.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-white text-sm font-semibold truncate pr-2 group-hover:text-cyan-400 transition-colors duration-300">
            {act.activity_title}
          </h4>
          <time className="text-slate-400 text-xs font-medium whitespace-nowrap">
            <TimeAgo time={act.created_at} />
          </time>
        </div>

        <p className="text-slate-400 text-sm mt-1 line-clamp-2 leading-relaxed">
          {act.activity_description}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-slate-500 text-xs">by you</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            <strong className="font-medium">{act.activity_type}</strong>
          </span>
        </div>
      </div>

      {/* Arrow indicator on hover */}
      <ChevronRight className="w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-1" />
    </motion.li>
  );
});

ActivityItem.displayName = "ActivityItem";

const typeMeta = {
  Project: {
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: "📁",
  },
  Update: {
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: "✏️",
  },
  Message: {
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: "✉️",
  },
  Delete: {
    color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    icon: "🗑️",
  },
};

const getMetaByKeyword = (type = "") => {
  const lowerType = type.toLowerCase();
  return (
    Object.entries(typeMeta).find(([key]) =>
      lowerType.includes(key.toLowerCase()),
    )?.[1] || {
      color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
      icon: "ℹ️",
    }
  );
};

const defaultActivities = [
  {
    id: "a1",
    type: "Project",
    title: "E‑commerce UI published",
    description: "Published new e‑commerce project with cart & checkout flows.",
    author: "You",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "a2",
    type: "Update",
    title: "Landing page draft created",
    description: "Draft for marketing landing page created (needs review).",
    author: "You",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3.5).toISOString(),
  },
  {
    id: "a3",
    type: "Message",
    title: "New message from Ali Khan",
    description: "Ali asks about a custom pricing card for his site.",
    author: "Ali Khan",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "a4",
    type: "Project",
    title: "Portfolio project updated",
    description: "Updated screenshots and SEO meta for the Blog project.",
    author: "You",
    time: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: "a5",
    type: "Delete",
    title: "Old prototype removed",
    description: "Removed an old prototype to declutter the projects list.",
    author: "You",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
];

const RecentActivity = () => {
  const { activities, isLoading } = useSelector((state) => state.activities);
  const prefersReducedMotion = useReducedMotion();

  const displayActivities =
    activities?.length > 0 ? activities : defaultActivities;
  const total = displayActivities.length;

  // Container animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.08,
          delayChildren: 0.1,
        },
      },
    }),
    [],
  );

  if (isLoading) {
    return <RecentActivitySkeleton />;
  }

  return (
    <motion.aside
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="w-full rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white text-lg font-bold tracking-tight">
              Recent Activity
            </h3>
            <p className="text-slate-400 text-sm">
              Latest {total} actions on your portfolio
            </p>
          </div>
        </div>

        <button
          className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2"
          onClick={() => console.log("View all clicked")}
        >
          View all
        </button>
      </header>

      {/* Activity List */}
      <div className="p-4">
        <motion.ul
          className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {displayActivities.map((act, index) => {
            const meta = getMetaByKeyword(act.activity_type);
            return (
              <ActivityItem
                key={act.id}
                act={act}
                meta={meta}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          })}
        </motion.ul>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.02]">
        <small className="text-slate-500 text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Auto-synced • Last 50 activities
        </small>
        <button className="text-sm px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2 group">
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Refresh
        </button>
      </footer>
    </motion.aside>
  );
};

export default memo(RecentActivity);
