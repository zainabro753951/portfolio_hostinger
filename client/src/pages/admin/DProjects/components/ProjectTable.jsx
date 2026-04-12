import React, { memo, useEffect, useMemo, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Pencil,
  Trash2,
  FolderKanban,
  Tag,
  Code2,
  FileText,
  ExternalLink,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";

const TableRow = memo(({ item, index, onDelete, prefersReducedMotion }) => {
  const rowVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: index * 0.05,
        },
      },
    }),
    [index, prefersReducedMotion],
  );

  const isPublished = item.status?.toLowerCase() === "published";
  const createdDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "—";

  const handleDelete = useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : rowVariants}
      initial="hidden"
      animate="show"
      className="group grid grid-cols-12 items-center text-sm border-b border-white/5 hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-300"
    >
      {/* ID */}
      <div className="col-span-1 py-4 px-4 text-center">
        <span className="text-xs font-mono text-slate-500">#{item.id}</span>
      </div>

      {/* Project Info */}
      <div className="col-span-3 py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20 flex-shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white truncate group-hover:text-cyan-300 transition-colors">
              {item.title}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {createdDate}
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="col-span-2 py-4 px-4">
        <div className="flex flex-wrap gap-1.5">
          {item?.tag?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20"
            >
              <Tag className="w-3 h-3" />
              {tag.name}
            </span>
          ))}
          {item?.tag?.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-400 text-xs">
              +{item.tag.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="col-span-2 py-4 px-4">
        <div className="flex flex-wrap gap-1.5">
          {item?.techStack?.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 text-xs border border-violet-500/20"
            >
              <Code2 className="w-3 h-3" />
              {tech.name}
            </span>
          ))}
          {item?.techStack?.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-400 text-xs">
              +{item.techStack.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="col-span-2 py-4 px-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isPublished
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          }`}
        >
          {isPublished ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Clock className="w-3.5 h-3.5" />
          )}
          {item.status}
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-2 py-4 px-4 flex items-center justify-end gap-2">
        {item.liveUrl && (
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all duration-300"
            title="View Live"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        <Link
          to={`/admin/add-project/${item.id}`}
          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 transition-all duration-300"
          title="Edit Project"
        >
          <Pencil className="w-4 h-4" />
        </Link>

        <button
          onClick={handleDelete}
          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all duration-300"
          title="Delete Project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});

TableRow.displayName = "TableRow";

const ProjectTable = () => {
  const { projects } = useSelector((state) => state.projects);
  const { setRoute, setIsOpen, setQueryKey } = useDeleteEntryContext();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setQueryKey("projects");
  }, [setQueryKey]);

  const handleDelete = useCallback(
    (id) => {
      setRoute(`/project/delete/${id}`);
      setIsOpen(true);
      setQueryKey("projects");
    },
    [setRoute, setIsOpen, setQueryKey],
  );

  const headers = useMemo(
    () => [
      { key: "id", label: "ID", width: "col-span-1" },
      { key: "project", label: "Project", width: "col-span-3" },
      { key: "tags", label: "Tags", width: "col-span-2" },
      { key: "tech", label: "Tech Stack", width: "col-span-2" },
      { key: "status", label: "Status", width: "col-span-2" },
      { key: "actions", label: "Actions", width: "col-span-2" },
    ],
    [],
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
      className="w-full "
    >
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm">
            {projects?.length || 0}{" "}
            {projects?.length === 1 ? "project" : "projects"} total
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-xl shadow-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 items-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10">
          {headers.map((head) => (
            <div
              key={head.key}
              className={`${head.width} py-4 px-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider ${head.key === "actions" ? "text-right" : head.key === "id" ? "text-center" : ""}`}
            >
              {head.label}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {projects?.length > 0 ? (
            projects.map((item, index) => (
              <TableRow
                key={item.id}
                item={item}
                index={index}
                onDelete={handleDelete}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                <FileText className="w-10 h-10 text-cyan-400/50" />
              </div>
              <p className="text-slate-400 text-lg font-medium">
                No projects found
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Add your first project to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProjectTable);
