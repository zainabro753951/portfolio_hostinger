import React, { useState, useMemo, memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  FaTasks,
  FaChartLine,
  FaPhotoVideo,
  FaGraduationCap,
  FaTools,
  FaUser,
} from "react-icons/fa";
import RecentActivity from "./RecentActivity";
import UserMessages from "./UserMessages";
import { useSelector } from "react-redux";
import ReplyModal from "../../DContactMessage/components/ReplyModal";

// Memoized Card Component for better performance
const StatCard = memo(({ item, index, prefersReducedMotion }) => {
  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: 30 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth animation
          delay: index * 0.1,
        },
      },
    }),
    [index],
  );

  const hoverAnimation = prefersReducedMotion
    ? {}
    : {
        y: -6,
        scale: 1.02,
        transition: { duration: 0.25, ease: "easeOut" },
      };

  const iconHoverAnimation = prefersReducedMotion
    ? {}
    : {
        rotate: 8,
        scale: 1.1,
        transition: { type: "spring", stiffness: 300, damping: 15 },
      };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      whileHover={hoverAnimation}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 border border-white/10 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500/30"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">
            {item.title}
          </p>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {item.quantity ?? 0}
          </h3>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {item.caption}
          </p>
        </div>

        <motion.div
          whileHover={iconHoverAnimation}
          className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors duration-300"
        >
          {item.icon}
        </motion.div>
      </div>
    </motion.div>
  );
});

StatCard.displayName = "StatCard";

const DHomeCards = () => {
  const { projectCounts, isLoading } = useSelector((state) => state.projects);
  const { educations } = useSelector((state) => state.education);
  const { skills } = useSelector((state) => state.skills);
  const { activeUsersCount } = useSelector((state) => state.siteSettings);
  console.log(activeUsersCount);

  const { visitorsCount } = useSelector((state) => state.visitorsCount);

  // Respect user's motion preferences for accessibility
  const prefersReducedMotion = useReducedMotion();

  // Memoized data to prevent unnecessary recalculations
  const dataCards = useMemo(
    () => [
      {
        icon: <FaTasks />,
        title: "Total Projects",
        quantity: projectCounts?.allProjects ?? 0,
        caption: `${projectCounts?.publishedProjects ?? 0} Published • ${projectCounts?.draftProjects ?? 0} Drafts`,
      },
      {
        icon: <FaChartLine />,
        title: "Site Visitors (30d)",
        quantity: visitorsCount ?? 0,
        caption: "Top page: /projects/e-commerce-ui",
      },
      {
        icon: <FaPhotoVideo />,
        title: "Media Files",
        quantity: 128,
        caption: "Storage used: 860MB",
      },
      {
        icon: <FaGraduationCap />,
        title: "Education",
        quantity: educations?.length ?? 0,
        caption: "Courses & Degrees",
      },
      {
        icon: <FaTools />,
        title: "Skills",
        quantity: skills?.length ?? 0,
        caption: "Top skills listed",
      },
      {
        icon: <FaUser />,
        title: "Active Users",
        quantity: activeUsersCount ?? 0,
        caption: `Currently online: ${activeUsersCount ?? 0}`,
      },
    ],
    [projectCounts, visitorsCount, educations, skills, activeUsersCount],
  );

  // Stagger container animation
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

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-800/50 animate-pulse border border-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10">
      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6"
      >
        {dataCards.map((item, idx) => (
          <StatCard
            key={item.title}
            item={item}
            index={idx}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </motion.div>

      {/* Bottom Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <UserMessages />
      </div>

      {/* Modal */}
      <ReplyModal />
    </section>
  );
};

export default memo(DHomeCards);
