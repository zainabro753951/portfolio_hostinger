import React, { memo } from "react";
import { motion } from "motion/react";
import { Wrench } from "lucide-react";
import SkillsTable from "./components/SkillsTable";
import SkillsForm from "./components/SkillsForm";

const DSkillsPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.15,
        delayChildren: 0.1,
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

  const glassCardClass = `
    rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 
    border border-white/10 backdrop-blur-xl p-6 shadow-xl w-full
  `.trim();

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      <div className="flex flex-col gap-6 items-start">
        {/* Skills Table */}
        <motion.div variants={itemVariants} className={glassCardClass}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              All Skills
            </h3>
          </div>
          <SkillsTable />
        </motion.div>

        {/* Add/Edit Skill Form */}
        <SkillsForm />
      </div>
    </motion.section>
  );
};

export default memo(DSkillsPage);
