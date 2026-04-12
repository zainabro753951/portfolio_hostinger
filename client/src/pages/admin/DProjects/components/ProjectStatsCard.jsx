import React, { memo, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FolderOpen, CheckCircle2, Clock } from "lucide-react";
import { useSelector } from "react-redux";

const StatCard = memo(({ item, index, prefersReducedMotion }) => {
  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20, scale: 0.95 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5,
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
        y: -4,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      };

  const getIconColor = () => {
    switch (item.label) {
      case "Total Projects":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "Published":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Drafts":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={hoverAnimation}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl bg-gradient-to-br ${item.color} p-6 transition-all duration-300 hover:shadow-lg hover:border-white/20`}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-center justify-between">
        {/* Icon Container */}
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center border ${getIconColor()} transition-transform duration-300 group-hover:scale-110`}
        >
          {item.icon}
        </div>

        {/* Content */}
        <div className="text-right">
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {item.value ?? 0}
          </h3>
          <p className="text-sm font-medium text-slate-400 mt-1">
            {item.label}
          </p>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl pointer-events-none" />
    </motion.div>
  );
});

StatCard.displayName = "StatCard";

const ProjectStatsCards = () => {
  const { projectCounts } = useSelector((state) => state.projects);
  const prefersReducedMotion = useReducedMotion();

  const stats = useMemo(
    () => [
      {
        icon: <FolderOpen className="w-6 h-6" />,
        label: "Total Projects",
        value: projectCounts?.allProjects,
        color: "from-cyan-500/10 via-cyan-500/5 to-transparent",
      },
      {
        icon: <CheckCircle2 className="w-6 h-6" />,
        label: "Published",
        value: projectCounts?.publishedProjects,
        color: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      },
      {
        icon: <Clock className="w-6 h-6" />,
        label: "Drafts",
        value: projectCounts?.draftProjects,
        color: "from-amber-500/10 via-amber-500/5 to-transparent",
      },
    ],
    [projectCounts],
  );

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
    >
      {stats.map((item, index) => (
        <StatCard
          key={item.label}
          item={item}
          index={index}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </motion.div>
  );
};

export default memo(ProjectStatsCards);
