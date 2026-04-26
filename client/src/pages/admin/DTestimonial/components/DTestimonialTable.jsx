import React, { useEffect, useState, memo, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Pencil,
  Trash2,
  User,
  Briefcase,
  Building2,
  Star,
  FolderKanban,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  Clock,
  Quote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { projectFindById } from "../../../../features/projectSlice";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";
import useCreatedAtSorted from "../../../../hooks/useCreatedAtSorted";
import {
  formatTimeAgo,
  getFileIcon,
  getFileNameFromUrl,
  safeParse,
} from "../../../../Utils/Utils";

const DTestimonialTable = () => {
  const dispatch = useDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { testimonials } = useSelector((state) => state.testimonial);
  const { project } = useSelector((state) => state.projects);
  let projectId = "";
  const [projectTitle, setProjectTitle] = useState("");
  const { setRoute, setIsOpen, setQueryKey } = useDeleteEntryContext();
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  const { sortedData: testiSorted } = useCreatedAtSorted(testimonials);

  // Set query key for delete context
  useEffect(() => {
    setQueryKey("testimonials");
  }, [setQueryKey]);

  // Fetch project by testimonial's projectId
  useEffect(() => {
    if (projectId) {
      dispatch(projectFindById(projectId));
    }
  }, [dispatch, projectId]);

  // Update project title once project is fetched
  useEffect(() => {
    if (project?.title) {
      setProjectTitle(project.title);
    } else {
      setProjectTitle("");
    }
  }, [project]);

  // Animation variants
  const containerVariants = {
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

  // Star rating display
  const renderStars = useCallback((rating) => {
    const stars = parseInt(rating) || 0;
    return (
      <div className="flex items-center justify-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              i < stars ? "fill-amber-400 text-amber-400" : "text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  }, []);

  // Table headers configuration
  const headers = [
    { key: "clientName", label: "Client Name", icon: User },
    { key: "designationRole", label: "Designation", icon: Briefcase },
    { key: "company", label: "Company", icon: Building2 },
    { key: "ratting", label: "Rating", icon: Star },
    { key: "projectTitle", label: "Project", icon: FolderKanban },
    { key: "testimonialDate", label: "Date", icon: Calendar },
    { key: "message", label: "Message", icon: MessageSquare },
    { key: "clientImage", label: "Profile", icon: ImageIcon },
    { key: "createdAt", label: "Created", icon: Clock },
    { key: "updatedAt", label: "Updated", icon: Clock },
    { key: "actions", label: "Actions", icon: null },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full "
    >
      <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <Quote className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              All Testimonials
            </h3>
            <p className="text-slate-400 text-sm">
              {testimonials?.length || 0}{" "}
              {testimonials?.length === 1 ? "testimonial" : "testimonials"}{" "}
              found
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="w-full rounded-xl border border-white/10 bg-slate-800/30 overflow-hidden">
          {/* Scrollable Wrapper */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[1800px] text-center ">
              {/* Table Header */}
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10">
                  {headers.map((head) => (
                    <th
                      key={head.key}
                      className="py-4 px-3 text-left text-xs sm:text-sm font-semibold text-cyan-300 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2">
                        {head.icon && (
                          <head.icon className="w-4 h-4 text-cyan-400" />
                        )}
                        {head.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-white/5">
                {testiSorted?.length > 0 ? (
                  testiSorted.map((item, index) => {
                    const createdAt = formatTimeAgo(item?.createdAt);
                    const updatedAt = formatTimeAgo(item?.updatedAt);
                    const clientImage = safeParse(item?.clientImage);
                    const fileName = getFileNameFromUrl(clientImage?.url);
                    const { Icon: FileIcon, color: FileIconColor } =
                      getFileIcon(fileName);

                    projectId = item?.projectId || "";

                    return (
                      <motion.tr
                        key={item.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-300"
                      >
                        {/* Client Name */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold">
                              {item?.clientName?.charAt(0)?.toUpperCase() ||
                                "?"}
                            </div>
                            <span className="text-sm text-white font-medium">
                              {item?.clientName}
                            </span>
                          </div>
                        </td>

                        {/* Designation */}
                        <td className="py-4 px-3">
                          <span className="text-sm text-slate-300">
                            {item?.designationRole}
                          </span>
                        </td>

                        {/* Company */}
                        <td className="py-4 px-3">
                          <span className="text-sm text-slate-300">
                            {item?.company}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="py-4 px-3">
                          {renderStars(item?.ratting)}
                        </td>

                        {/* Project Title */}
                        <td className="py-4 px-3">
                          <span className="text-sm text-slate-300">
                            {projectTitle || "—"}
                          </span>
                        </td>

                        {/* Testimonial Date */}
                        <td className="py-4 px-3">
                          <span className="text-sm text-slate-300">
                            {item?.testimonialDate}
                          </span>
                        </td>

                        {/* Message */}
                        <td className="py-4 px-3">
                          <p className="text-sm text-slate-400 line-clamp-2 max-w-[200px]">
                            {item?.message}
                          </p>
                        </td>

                        {/* Profile Image */}
                        <td className="py-4 px-3 flex items-center justify-center">
                          {clientImage && clientImage?.url ? (
                            <motion.a
                              href={`${backendUrl}${clientImage.url}`}
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
                            <span className="text-slate-500 text-xs">
                              No certificate
                            </span>
                          )}
                        </td>

                        {/* Created At */}
                        <td className="py-4 px-3">
                          <span className="text-xs text-slate-500">
                            {createdAt}
                          </span>
                        </td>

                        {/* Updated At */}
                        <td className="py-4 px-3">
                          <span className="text-xs text-slate-500">
                            {updatedAt}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/testimonials/${item?.id}`}
                              className="p-2 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:from-cyan-500/50 hover:to-blue-500/50 hover:text-white transition-all duration-300 hover:scale-110"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => {
                                setIsOpen(true);
                                setQueryKey("testimonials");
                                setRoute(`/testimonial/delete/${item?.id}`);
                              }}
                              className="p-2 rounded-lg bg-gradient-to-r from-rose-600/30 to-red-600/30 border border-rose-500/40 text-rose-300 hover:from-rose-500/50 hover:to-red-500/50 hover:text-white transition-all duration-300 hover:scale-110"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                          <Quote className="w-8 h-8 text-cyan-400" />
                        </div>
                        <p className="text-slate-400 text-lg">
                          No testimonials found
                        </p>
                        <p className="text-slate-500 text-sm">
                          Add your first testimonial to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(DTestimonialTable);
