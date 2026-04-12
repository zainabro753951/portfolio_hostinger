import React, { memo, useEffect, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Pencil, Trash2, Wrench, Gauge, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";

// Proficiency badge component
const ProficiencyBadge = memo(({ level }) => {
  const getStyles = () => {
    if (level >= 80)
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (level >= 60) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    if (level >= 40)
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  };

  const getLabel = () => {
    if (level >= 80) return "Expert";
    if (level >= 60) return "Advanced";
    if (level >= 40) return "Intermediate";
    return "Beginner";
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStyles()}`}
    >
      <Zap className="w-3.5 h-3.5" />
      {getLabel()} ({level}%)
    </span>
  );
});

ProficiencyBadge.displayName = "ProficiencyBadge";

// Table row component
const SkillRow = memo(({ item, index, onDelete, prefersReducedMotion }) => {
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
      className="group grid grid-cols-3 items-center text-sm border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-300"
    >
      {/* Skill Name */}
      <div className="py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Wrench className="w-4 h-4 text-slate-500" />
          <span className="font-medium text-white">{item.skillName}</span>
        </div>
      </div>

      {/* Proficiency */}
      <div className="py-4 px-4 text-center">
        <ProficiencyBadge level={item.proficiency} />
      </div>

      {/* Actions */}
      <div className="py-4 px-4 flex justify-center gap-2">
        <Link
          to={`/admin/skills/${item?.id}`}
          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 transition-all duration-300"
          title="Edit Skill"
        >
          <Pencil className="w-4 h-4" />
        </Link>

        <button
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all duration-300"
          title="Delete Skill"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});

SkillRow.displayName = "SkillRow";

const SkillsTable = () => {
  const { skills } = useSelector((state) => state.skills);
  const { setRoute, setIsOpen, setQueryKey } = useDeleteEntryContext();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setQueryKey("skills");
  }, [setQueryKey]);

  const handleDelete = useCallback(
    (id) => {
      setRoute(`/skill/delete/${id}`);
      setIsOpen(true);
      setQueryKey("skills");
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

  const headers = useMemo(
    () => [
      { key: "name", label: "Skill", icon: Wrench },
      { key: "proficiency", label: "Proficiency", icon: Gauge },
      { key: "action", label: "Actions", icon: null },
    ],
    [],
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Table Header */}
      <div className="grid grid-cols-3 items-center bg-white/[0.02] border-b border-white/10">
        {headers.map((head) => (
          <div
            key={head.key}
            className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-2"
          >
            {head.icon && <head.icon className="w-4 h-4" />}
            {head.label}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {skills?.length > 0 ? (
          skills.map((item, index) => (
            <SkillRow
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
              <Wrench className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm">No skills added yet</p>
            <p className="text-slate-600 text-xs mt-1">
              Add your first skill to get started
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(SkillsTable);
