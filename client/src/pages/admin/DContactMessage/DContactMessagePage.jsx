import React, { memo } from "react";
import { motion } from "motion/react";
import { Mail, MessageSquare, BarChart3, Eye } from "lucide-react";
import ContactMessageHeader from "./components/ContactMessageHeader";
import CMTable from "./components/CMTable";
import DQuickStats from "./components/DQuickStats";
import DMessageView from "./components/DMessageView";
import ReplyModal from "./components/ReplyModal";

const DContactMessagePage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <Mail className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Contact Messages
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Manage and respond to user inquiries
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="flex flex-col gap-8 sm:gap-10">
        {/* Header Component */}
        <motion.div variants={itemVariants}>
          <ContactMessageHeader />
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          variants={itemVariants}
          className="w-full flex flex-col gap-6 sm:gap-8"
        >
          {/* Table Section - Takes 2 columns on large screens */}
          <div className="xl:col-span-2">
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                All Messages
              </h2>
            </div>
            <CMTable />
          </div>

          {/* Stats & View Section - Takes 1 column */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Quick Stats */}
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Statistics
                </h2>
              </div>
              <DQuickStats />
            </div>

            {/* Message View */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Eye className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Message Details
                </h2>
              </div>
              <DMessageView />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reply Modal */}
      <ReplyModal />
    </motion.section>
  );
};

export default memo(DContactMessagePage);
