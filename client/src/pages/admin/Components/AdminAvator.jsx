import React, { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Shield, User } from "lucide-react";

const AdminAvatar = () => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const avatarHoverAnimation = prefersReducedMotion
    ? {}
    : { rotate: 5, scale: 1.05 };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex items-center gap-3 sm:gap-4 md:p-4 p-2 rounded-xl bg-slate-800/50 border border-white/10 backdrop-blur-md shadow-lg w-full"
    >
      {/* Avatar Container */}
      <motion.div
        whileHover={avatarHoverAnimation}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="relative w-8 h-8 md:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/20"
      >
        <img
          src="https://images.saymedia-content.com/.image/t_share/MTk4OTEyNDE2Mzg0Mjk2Mjk5/songs-about-men.jpg"
          className="w-full h-full object-cover"
          alt="Admin Avatar"
        />
        {/* Online indicator */}
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
      </motion.div>

      {/* Info */}
      <div className="hidden md:block flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            Zain Abro
          </h1>
          <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        </div>
        <p className="text-slate-400 text-xs sm:text-sm flex items-center gap-1.5">
          <User className="w-3 h-3" />
          Portfolio Admin
        </p>
      </div>
    </motion.div>
  );
};

export default memo(AdminAvatar);
