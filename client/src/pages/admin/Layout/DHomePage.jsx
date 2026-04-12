import React, { memo, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import DHomeCards from "../DHome/components/DHomeCards";
import DeleteConfirm from "../Components/DeleteConfirm";
import { useDeleteEntryContext } from "../../../context/DeleteEntry";

const DHomePage = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  // Check if current route is exactly /admin (without child)
  const isDashboard = useMemo(
    () => location.pathname === "/admin" || location.pathname === "/admin/",
    [location.pathname],
  );

  // Animated blob variants
  const blobVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: (delay) => ({
      opacity: 0.6,
      scale: 1,
      transition: {
        duration: 2,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="w-full h-screen font-sans bg-slate-950 relative overflow-hidden text-white">
      {/* Animated Background Blobs */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            custom={0}
            variants={blobVariants}
            initial="hidden"
            animate="show"
            className="absolute -top-32 -left-32 w-96 h-96 md:w-[500px] md:h-[500px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none"
          />
          <motion.div
            custom={0.3}
            variants={blobVariants}
            initial="hidden"
            animate="show"
            className="absolute -bottom-32 -right-32 w-96 h-96 md:w-[500px] md:h-[500px] bg-violet-500/20 blur-[120px] rounded-full pointer-events-none"
          />
          <motion.div
            custom={0.6}
            variants={blobVariants}
            initial="hidden"
            animate="show"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"
          />
        </>
      )}

      {/* Main Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full h-full flex"
      >
        {/* Sidebar */}
        <motion.div variants={containerVariants} className="flex-shrink-0">
          <Sidebar />
        </motion.div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col backdrop-blur-sm bg-slate-900/30 border-l border-white/5 overflow-hidden">
          {/* Header - Sticky */}
          <div className="flex-shrink-0 z-50">
            <Header />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
            {isDashboard ? <DHomeCards /> : <Outlet />}
          </div>
        </main>

        {/* Global Components */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
        />
        <DeleteConfirm />
      </motion.div>
    </div>
  );
};

export default memo(DHomePage);
