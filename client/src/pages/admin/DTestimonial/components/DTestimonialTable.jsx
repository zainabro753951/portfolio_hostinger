import { useDeleteEntryContext } from "@/context/useDeleteEntryContext";
import useCreatedAtSorted from "@/hooks/useCreatedAtSorted";
import { formatTimeAgo, safeParse } from "@/Utils/Utils";
import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  FolderKanban,
  Image as ImageIcon,
  MessageSquare,
  Pencil,
  Quote,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const parseCloudinaryImage = (value) => {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    if (!parsed || typeof parsed !== "object" || !parsed.url) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Invalid testimonial image data:", error);
    return null;
  }
};

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

const DTestimonialTable = () => {
  const prefersReducedMotion = useReducedMotion();
  const { testimonials = [] } = useSelector((state) => state.testimonial);
  // New
  const { projects } = useSelector((state) => state.projects);
  // ✅ Yeh add karo — projects ka map banao
  const { setRoute, setIsOpen, setQueryKey } = useDeleteEntryContext();
  // ✅ Yeh already store mein hai
  const { sortedData: testiSorted } = useCreatedAtSorted(testimonials || []);

  // Set query key for delete context
  useEffect(() => {
    setQueryKey("testimonials");
  }, [setQueryKey]);

  // ✅ Seedha map banao projects array se
  const projectTitlesMap = useMemo(() => {
    return (projects || []).reduce((acc, project) => {
      if (project?.id != null) {
        acc[String(project.id)] = project?.title || "Untitled Project";
      }

      return acc;
    }, {});
  }, [projects]);

  // Star rating display
  const renderStars = useCallback((rating) => {
    const parsedRating = Number(rating);

    const stars = Number.isFinite(parsedRating)
      ? Math.min(5, Math.max(0, Math.round(parsedRating)))
      : 0;

    return (
      <div
        className="flex items-center justify-center gap-0.5"
        aria-label={`${stars} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={`h-3 w-3 sm:h-4 sm:w-4 ${
              i < stars ? "fill-amber-400 text-amber-400" : "text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  }, []);

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
                    const clientImage = parseCloudinaryImage(item?.clientImage);

                    return (
                      <motion.tr
                        key={item.id || index}
                        initial={
                          prefersReducedMotion ? false : { opacity: 0, y: 8 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: prefersReducedMotion
                            ? 0
                            : Math.min(index * 0.03, 0.3),
                        }}
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
                            {projectTitlesMap[String(item?.projectId)] || "—"}
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
                        <td className="py-4 px-3">
                          <div className="flex items-center justify-center">
                            {clientImage?.url ? (
                              <motion.a
                                href={clientImage.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View ${item?.clientName || "client"} profile image`}
                                whileHover={
                                  prefersReducedMotion
                                    ? undefined
                                    : {
                                        scale: 1.08,
                                        y: -2,
                                      }
                                }
                                whileTap={
                                  prefersReducedMotion
                                    ? undefined
                                    : {
                                        scale: 0.95,
                                      }
                                }
                                className="group relative mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-700/50 shadow-md"
                              >
                                <img
                                  src={clientImage.url}
                                  alt={`${item?.clientName || "Client"} profile`}
                                  loading="lazy"
                                  decoding="async"
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />

                                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                  <ImageIcon className="h-5 w-5" />
                                </span>
                              </motion.a>
                            ) : (
                              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-700/40">
                                <User className="h-5 w-5 text-slate-500" />
                              </div>
                            )}
                          </div>
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
                              aria-label={`Edit testimonial by ${item?.clientName || "client"}`}
                              className="p-2 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:from-cyan-500/50 hover:to-blue-500/50 hover:text-white transition-all duration-300 hover:scale-110"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>

                            <button
                              type="button"
                              aria-label={`Delete testimonial by ${item?.clientName || "client"}`}
                              onClick={() => {
                                setQueryKey("testimonials");
                                setRoute(`/testimonial/delete/${item?.id}`);
                                setIsOpen(true);
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
