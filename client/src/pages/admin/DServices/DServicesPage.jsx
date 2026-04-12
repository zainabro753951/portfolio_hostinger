import React, { memo } from "react";
import { motion } from "motion/react";
import { Wrench, List, Plus } from "lucide-react";
import ServiceForm from "./Components/ServiceForm";
import ServiceTable from "./Components/ServiceTable";

const DServicesPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Services
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Manage your services and offerings
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="flex flex-col gap-8 sm:gap-10">
        {/* Table Section */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <List className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              All Services
            </h2>
          </div>
          <ServiceTable />
        </motion.div>

        {/* Form Section */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <Plus className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Add New Service
            </h2>
          </div>
          <ServiceForm />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default memo(DServicesPage);
