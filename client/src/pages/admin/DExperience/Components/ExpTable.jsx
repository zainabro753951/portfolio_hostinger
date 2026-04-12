import React, { memo, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  Wrench,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";

// Table row component
const ExpRow = memo(({ item, index, onDelete, prefersReducedMotion }) => {
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

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isCurrentlyWorking = item?.currentlyWorking === 1 || !item?.endDate;

  return (
    <motion.div
      variants={rowVariants}
      initial="hidden"
      animate="show"
      className="group flex items-center text-sm border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-300 min-w-[1200px]"
    >
      {/* ID */}
      <div className="py-4 px-3 text-center text-slate-400 font-medium w-16 flex-shrink-0">
        #{item?.id}
      </div>

      {/* Position */}
      <div className="py-4 px-3 w-48 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="font-medium text-white truncate">
            {item?.position}
          </span>
        </div>
      </div>

      {/* Company */}
      <div className="py-4 px-3 w-40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span className="text-slate-300 truncate">{item?.company}</span>
        </div>
      </div>

      {/* Employment Type */}
      <div className="py-4 px-3 text-center w-28 flex-shrink-0">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
          {item?.employmentType}
        </span>
      </div>

      {/* Started At */}
      <div className="py-4 px-3 text-center text-slate-400 text-xs w-28 flex-shrink-0">
        <div className="flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{formatDate(item?.startedAt)}</span>
        </div>
      </div>

      {/* End Date */}
      <div className="py-4 px-3 text-center w-28 flex-shrink-0">
        {isCurrentlyWorking ? (
          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            Present
          </span>
        ) : (
          <span className="text-slate-400 text-xs flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{formatDate(item?.endDate)}</span>
          </span>
        )}
      </div>

      {/* Technologies */}
      <div className="py-4 px-3 w-48 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span className="text-slate-400 text-xs truncate">
            {item?.technologies || "N/A"}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="py-4 px-3 flex-1 min-w-[200px]">
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-slate-400 text-xs line-clamp-2 break-words">
            {item?.description || "No description"}
          </p>
        </div>
      </div>

      {/* Company Logo */}
      <div className="py-4 px-3 flex justify-center w-16 flex-shrink-0">
        {item?.companyLogo?.url ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800/50 border border-white/10 flex-shrink-0">
            <img
              src={item.companyLogo.url}
              alt={item.company}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center border border-white/10 flex-shrink-0">
            <ImageIcon className="w-5 h-5 text-slate-600" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="py-4 px-3 flex justify-center gap-2 w-24 flex-shrink-0">
        <Link
          to={`/admin/experience/${item?.id}`}
          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 transition-all duration-300 flex-shrink-0"
          title="Edit Experience"
        >
          <Pencil className="w-4 h-4" />
        </Link>

        <button
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all duration-300 flex-shrink-0"
          title="Delete Experience"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});

ExpRow.displayName = "ExpRow";

const ExpTable = () => {
  const { experiences } = useSelector((state) => state.experience);
  const { setRoute, setIsOpen, setQueryKey } = useDeleteEntryContext();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setQueryKey("experiences");
  }, [setQueryKey]);

  const handleDelete = useCallback(
    (id) => {
      setRoute(`/experience/delete/${id}`);
      setIsOpen(true);
      setQueryKey("experiences");
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
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            All Experience
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            {experiences?.length || 0} entries
          </p>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[1400px]">
          {/* Table Header - Fixed Layout */}
          <div className="flex items-center bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-slate-400 uppercase tracking-wider sticky top-0 z-10">
            <div className="py-3 px-3 text-center w-16 flex-shrink-0">ID</div>
            <div className="py-3 px-3 w-48 flex-shrink-0">Position</div>
            <div className="py-3 px-3 w-40 flex-shrink-0">Company</div>
            <div className="py-3 px-3 text-center w-28 flex-shrink-0">Type</div>
            <div className="py-3 px-3 text-center w-28 flex-shrink-0">
              Started
            </div>
            <div className="py-3 px-3 text-center w-28 flex-shrink-0">
              Ended
            </div>
            <div className="py-3 px-3 w-48 flex-shrink-0">Technologies</div>
            <div className="py-3 px-3 flex-1 min-w-[200px]">Description</div>
            <div className="py-3 px-3 text-center w-16 flex-shrink-0">Logo</div>
            <div className="py-3 px-3 text-center w-24 flex-shrink-0">
              Actions
            </div>
          </div>

          {/* Table Body */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {experiences?.length > 0 ? (
              experiences.map((item, index) => (
                <ExpRow
                  key={item.id}
                  item={item}
                  index={index}
                  onDelete={handleDelete}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))
            ) : (
              <div className="py-12 text-center min-w-[1200px]">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm">
                  No experience entries found
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  Add your first work experience
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ExpTable);
