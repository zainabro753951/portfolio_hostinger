import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTasks,
  FaChartLine,
  FaPhotoVideo,
  FaGraduationCap,
  FaTools,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import RecentActivity from "./RecentActivity";
import UserMessages from "./UserMessages";
import { useSelector } from "react-redux";

const DHomeCards = () => {
  const { projectCounts, isLoading } = useSelector((state) => state.projects);
  const { educations } = useSelector((state) => state.education);
  const { skills } = useSelector((state) => state.skills);
  const { activeUsersCount } = useSelector((state) => state.siteSettings);
  const { visitorsCount } = useSelector((state) => state.visitorsCount);

  console.log();

  // -------------------------
  // Sample Data
  // -------------------------
  const dataCards = [
    {
      icon: <FaTasks />,
      title: "Total Projects",
      quantity: projectCounts?.allProjects,
      caption: `${projectCounts?.publishedProjects} Published • ${projectCounts?.draftProjects} Drafts`,
    },
    {
      icon: <FaChartLine />,
      title: "Site Visitors (30d)",
      quantity: visitorsCount,
      caption: "Top page: /projects/e-commerce-ui",
    },
    {
      icon: <FaPhotoVideo />,
      title: "Media Files",
      quantity: "128",
      caption: "Storage used: 860MB",
    },
    {
      icon: <FaGraduationCap />,
      title: "Education",
      quantity: educations.length,
      caption: "Courses & Degrees",
    },
    {
      icon: <FaTools />,
      title: "Skills",
      quantity: skills.length,
      caption: "Top skills listed",
    },
    {
      icon: <FaUser />,
      title: "Active Users",
      quantity: activeUsersCount,
      caption: `Currently online: ${activeUsersCount}`,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="md:px-[1.5vw] sm:px-[2.5vw] xs:px-[3.5vw] md:my-[2vw] sm:my-[3vw] xs:my-[5vw] flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
      {/* --------------------- TOP CARDS --------------------- */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]"
      >
        {dataCards.map((item, idx) => (
          <motion.div
            key={idx}
            variants={fadeUp}
            whileHover={{
              y: -8,
              scale: 1.02,
              boxShadow:
                "0 0 10px #06b5d46c,0 0 20px #06b5d463,0 0 30px #06b5d442",
            }}
            transition={{ duration: 0.3 }}
            className="md:w-full md:p-[1.5vw] sm:p-[2.5vw] xs:p-[3.5vw] md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw]
                       bg-linear-to-br from-[#0a0a2a]/60 to-[#101040]/30 border border-white/20 backdrop-blur-2xl"
          >
            <div className="w-full flex items-center justify-between">
              <div>
                <p className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 font-semibold">
                  {item.title}
                </p>
                <h3 className="md:text-[2vw] sm:text-[3vw] xs:text-[5vw] font-bold text-white">
                  {item.quantity}
                </h3>
              </div>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="md:w-[3.5vw] md:h-[3.5vw] sm:w-[5vw] sm:h-[5vw] xs:w-[7vw] xs:h-[7vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw]
                           bg-cyan-500/20 text-cyan-300 flex items-center justify-center md:text-[1.5vw] sm:text-[2.5vw] xs:text-[4.5vw]"
              >
                {item.icon}
              </motion.div>
            </div>
            <p className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw] text-gray-400 mt-[0.5vw]">
              {item.caption}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* --------------------- BOTTOM GRID --------------------- */}
      <div className="w-full grid md:grid-cols-2 xs:grid-cols-1 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw] items-start">
        {/* --------------------- Recent Activity --------------------- */}
        <RecentActivity />

        {/* --------------------- User Messages --------------------- */}
        <UserMessages />
      </div>
    </section>
  );
};

export default DHomeCards;
