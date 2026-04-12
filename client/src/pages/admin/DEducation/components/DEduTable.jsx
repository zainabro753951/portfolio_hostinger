import React, { memo, useEffect, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
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

// Table row component
const EduRow = memo(({ item, index, onDelete, prefersReducedMotion }) => {
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
      className="group grid grid-cols-5 items-center text-sm border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-300"
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
            {educations?.length || 0} entries
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 items-center bg-white/[0.02] border-b border-white/10">
        <div className="col-span-4 py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Education Details
        </div>
        <div className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
          Actions
        </div>
      </div>

      {/* Table Body */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {educations?.length > 0 ? (
          educations.map((item, index) => (
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
