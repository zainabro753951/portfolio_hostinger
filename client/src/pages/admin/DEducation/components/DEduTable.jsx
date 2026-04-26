import React, { memo, useEffect, useCallback, useMemo } from "react";
import { color, motion, useReducedMotion } from "motion/react";
import {
  Pencil,
  Trash2,
  GraduationCap,
  Building2,
  Calendar,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";
import {
  formatDateTime,
  formatTimeAgo,
  getFileIcon,
  getFileNameFromUrl,
} from "../../../../Utils/Utils";
import useCreatedAtSorted from "../../../../hooks/useCreatedAtSorted";

// Table row component
const EduRow = memo(({ item, index, onDelete, prefersReducedMotion }) => {
  // Component ke andar (jahaan prefersReducedMotion use ho raha hai)
  const certificate =
    typeof item?.certificate === "string"
      ? JSON.parse(item?.certificate)
      : item?.certificate;
  // ✅ Check: certificate exist karta hai AND usme atleast 1 property hai
  const isCertificate = certificate && Object.keys(certificate).length > 0;
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;
  const fileName = getFileNameFromUrl(certificate?.url);
  const { Icon: FileIcon, color: FileIconColor } = getFileIcon(fileName);

  // ✅ Relative time calculate karein
  const createdAtRelative = formatTimeAgo(item?.createdAt);

  const updatedAtRelative = formatTimeAgo(item?.updatedAt);

  const rowVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -20 },
      show: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: index * 0.05,
        },
      },
    }),
    [index],
  );

  return (
    <motion.div
      variants={rowVariants}
      initial="hidden"
      animate="show"
      className="group grid grid-cols-8 items-center text-sm border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-300"
    >
      {/* Education Info */}
      <div className="col-span-4 py-4 px-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-base truncate">
              {item?.institutionName || "Institution Name"}
            </h3>
            <p className="text-slate-400 text-sm mt-0.5">
              {item.degree} - {item.fieldStudy}
            </p>
            <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {item.startYear} - {item.endYear}
            </p>
          </div>
        </div>
      </div>

      {/* Certificate */}
      <div className="py-4 px-4">
        {/* File Icon */}
        {isCertificate && certificate?.url ? (
          <motion.a
            href={`${backendUrl}${certificate.url}`}
            target="_blank"
            rel="noopener noreferrer"
            // ✅ Animation variants
            variants={{
              hidden: { opacity: 0.8 },
              hover: {
                scale: prefersReducedMotion ? 1 : 1.05,
                borderColor: prefersReducedMotion
                  ? FileIconColor
                  : FileIconColor,
                boxShadow: prefersReducedMotion
                  ? "none"
                  : `0 0 20px ${FileIconColor}40, 0 0 40px ${FileIconColor}20`,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  mass: 0.8,
                },
              },
              tap: {
                scale: prefersReducedMotion ? 1 : 0.95,
                transition: { duration: 0.1 },
              },
            }}
            initial="hidden"
            whileHover="hover"
            whileTap="tap"
            // ✅ Static styles
            className="w-12 h-12 rounded-lg flex items-center justify-center border  flex-shrink-0 cursor-pointer overflow-hidden relative group"
            style={{
              backgroundColor: FileIconColor + "20",
              borderColor: FileIconColor,
            }}
          >
            {/* ✅ Animated Icon with color shift */}
            <motion.div
              variants={{
                hover: {
                  rotate: prefersReducedMotion ? 0 : 15,
                  scale: prefersReducedMotion ? 1 : 1.1,
                },
              }}
              className="relative z-10"
            >
              <FileIcon
                className="w-6 h-6 stroke-current transition-colors duration-300"
                style={{
                  color: FileIconColor,
                  filter: prefersReducedMotion
                    ? "none"
                    : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                }}
              />
            </motion.div>

            {/* ✅ Animated background glow effect */}
            <motion.div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at center, ${FileIconColor}30 0%, transparent 70%)`,
              }}
            />

            {/* ✅ Subtle border pulse animation */}
            <motion.div
              className="absolute inset-0 rounded-lg border-2 opacity-0 group-hover:opacity-100"
              style={{ borderColor: FileIconColor }}
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{
                scale: 1.2,
                opacity: [0, 1, 0],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />

            {/* ✅ Tooltip hint (optional) */}
            <motion.span
              className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap bg-slate-900/90 backdrop-blur-sm border border-white/10 opacity-0 pointer-events-none"
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              View Certificate ↗
            </motion.span>
          </motion.a>
        ) : (
          <span className="text-slate-500 text-xs">No certificate</span>
        )}
      </div>

      {/* ✅ Created At Column */}
      <div className="py-4 px-4">
        <span
          className="text-slate-300 text-xs font-medium"
          title={item?.createdAt}
        >
          {createdAtRelative}
        </span>
      </div>

      {/* ✅ Updated At Column */}
      <div className="py-4 px-4">
        <span
          className="text-slate-300 text-xs font-medium"
          title={item?.updatedAt}
        >
          {updatedAtRelative}
        </span>
      </div>

      {/* Actions */}
      <div className="py-4 px-4 flex justify-center gap-2">
        <Link
          to={`/admin/education/${item?.id}`}
          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 transition-all duration-300"
          title="Edit Education"
        >
          <Pencil className="w-4 h-4" />
        </Link>

        <button
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all duration-300"
          title="Delete Education"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});

EduRow.displayName = "EduRow";

const DEduTable = () => {
  const { educations } = useSelector((state) => state.education);
  const { setRoute, setIsOpen, setQueryKey } = useDeleteEntryContext();
  const prefersReducedMotion = useReducedMotion();

  // Education sorted
  const { sortedData: sortedEdu } = useCreatedAtSorted(educations);

  useEffect(() => {
    setQueryKey("educations");
  }, [setQueryKey]);

  const handleDelete = useCallback(
    (id) => {
      setRoute(`/education/delete/${id}`);
      setIsOpen(true);
      setQueryKey("educations");
    },
    [setRoute, setIsOpen, setQueryKey],
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
          staggerChildren: 0.05,
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
      <div className="flex items-center gap-3 p-6 border-b border-white/5 bg-white/[0.02]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            All Education
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            {sortedEdu?.length || 0} entries
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-8 items-center bg-white/[0.02] border-b border-white/10">
        <div className="col-span-4 py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Education Details
        </div>
        <div className=" py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Certificate
        </div>
        <div className=" py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Created At
        </div>
        <div className=" py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Updated At
        </div>

        <div className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
          Actions
        </div>
      </div>

      {/* Table Body */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {sortedEdu?.length > 0 ? (
          sortedEdu.map((item, index) => (
            <EduRow
              key={item.id}
              item={item}
              index={index}
              onDelete={handleDelete}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm">No education entries found</p>
            <p className="text-slate-600 text-xs mt-1">
              Add your first education entry
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(DEduTable);
