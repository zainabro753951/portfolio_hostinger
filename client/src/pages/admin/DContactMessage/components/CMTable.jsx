import React, { useEffect, useRef, memo, useCallback } from "react";
import { motion } from "motion/react";
import {
  Eye,
  Trash2,
  Mail,
  MapPin,
  Globe,
  Wifi,
  Calendar,
  CheckCircle2,
  Clock,
  Hash,
  User,
  FileText,
  Mail as MailIcon,
  Building2,
  Flag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  contactMsgFindById,
  selectAllMessages,
  toggleSelectMessage,
} from "../../../../features/messageSlice";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";

const CMTable = () => {
  const { contactCurrentMessages, currentPageMsgsCounts } = useSelector(
    (state) => state.contactMessages,
  );
  const { setRoute, setIds, setQueryKey, setIsOpen } = useDeleteEntryContext();
  const dispatch = useDispatch();
  const masterRef = useRef(null);

  // Set query key for delete context
  useEffect(() => {
    setQueryKey("contactMessages");
  }, [setQueryKey]);

  // Update master checkbox state
  useEffect(() => {
    if (contactCurrentMessages.length > 0 && masterRef.current) {
      const allSelected = contactCurrentMessages.every((m) => m.selected);
      const someSelected = contactCurrentMessages.some((m) => m.selected);
      masterRef.current.checked = allSelected;
      masterRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [contactCurrentMessages]);

  // Handlers
  const handleSelectAll = useCallback(
    (e) => {
      dispatch(selectAllMessages(e.target.checked));
    },
    [dispatch],
  );

  const handleRowSelect = useCallback(
    (id) => {
      dispatch(toggleSelectMessage(id));
    },
    [dispatch],
  );

  const handleViewMessage = useCallback(
    (id) => {
      dispatch(contactMsgFindById(id));
    },
    [dispatch],
  );

  const setDeleteIds = useCallback(
    (id = null) => {
      let idsToDelete = [];
      if (id) {
        idsToDelete = [id];
      } else {
        idsToDelete = contactCurrentMessages
          .filter((m) => m.selected)
          .map((m) => m.id);
      }

      if (idsToDelete.length === 0) {
        return;
      }

      setIds(idsToDelete);
      setIsOpen(true);
      setRoute("/message/delete");
      setQueryKey("contactMessages");
    },
    [contactCurrentMessages, setIds, setIsOpen, setRoute, setQueryKey],
  );

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

  // Table headers configuration
  const headers = [
    { key: "select", label: "", icon: null, width: "w-12" },
    { key: "id", label: "ID", icon: Hash, width: "w-16" },
    { key: "planId", label: "Plan ID", icon: FileText, width: "w-24" },
    { key: "fullName", label: "Sender", icon: User, width: "w-32" },
    { key: "subject", label: "Subject", icon: MailIcon, width: "w-40" },
    { key: "email", label: "Email", icon: Mail, width: "w-48" },
    { key: "city", label: "City", icon: Building2, width: "w-24" },
    { key: "country", label: "Country", icon: Flag, width: "w-24" },
    { key: "isp", label: "ISP", icon: Wifi, width: "w-32" },
    { key: "location", label: "Location", icon: MapPin, width: "w-32" },
    { key: "ip", label: "IP Address", icon: Globe, width: "w-32" },
    { key: "region", label: "Region", icon: Flag, width: "w-24" },
    { key: "date", label: "Date", icon: Calendar, width: "w-32" },
    { key: "status", label: "Status", icon: CheckCircle2, width: "w-24" },
    { key: "actions", label: "Actions", icon: null, width: "w-24" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full "
    >
      <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 shadow-xl overflow-hidden">
        {/* Table Container */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1400px] table-auto">
            {/* Table Header */}
            <thead>
              <tr className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10">
                {headers.map((head) => (
                  <th
                    key={head.key}
                    className={`py-4 px-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider ${head.width}`}
                  >
                    <div className="flex items-center gap-2">
                      {head.key === "select" ? (
                        <input
                          ref={masterRef}
                          type="checkbox"
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/20 bg-slate-700 cursor-pointer"
                        />
                      ) : (
                        <>
                          {head.icon && (
                            <head.icon className="w-4 h-4 text-cyan-400" />
                          )}
                          {head.label}
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/5">
              {contactCurrentMessages?.length > 0 ? (
                contactCurrentMessages.map((item, index) => {
                  const date = new Date(item?.createdAt).toLocaleDateString();

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={`group hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-300 ${
                        item.selected ? "bg-cyan-500/10" : ""
                      }`}
                    >
                      {/* Select */}
                      <td className="py-4 px-3">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleRowSelect(item?.id)}
                          className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/20 bg-slate-700 cursor-pointer"
                        />
                      </td>

                      {/* ID */}
                      <td className="py-4 px-3">
                        <span className="text-xs text-slate-500 font-mono">
                          #{item.id}
                        </span>
                      </td>

                      {/* Plan ID */}
                      <td className="py-4 px-3">
                        <span className="text-sm text-slate-300">
                          {item.planId || "—"}
                        </span>
                      </td>

                      {/* Sender */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold">
                            {item.fullName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="text-sm text-white font-medium truncate max-w-[100px]">
                            {item.fullName}
                          </span>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="py-4 px-3">
                        <span className="text-sm text-slate-300 truncate max-w-[150px] block">
                          {item.subject}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-3">
                        <span className="text-xs text-slate-400 truncate max-w-[180px] block">
                          {item.email}
                        </span>
                      </td>

                      {/* City */}
                      <td className="py-4 px-3">
                        <span className="text-sm text-slate-300">
                          {item?.city || "—"}
                        </span>
                      </td>

                      {/* Country */}
                      <td className="py-4 px-3">
                        <span className="text-sm text-slate-300">
                          {item?.country || "—"}
                        </span>
                      </td>

                      {/* ISP */}
                      <td className="py-4 px-3">
                        <span className="text-xs text-slate-400 truncate max-w-[100px] block">
                          {item?.isp || "—"}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-3">
                        <span className="text-xs text-slate-500 font-mono">
                          {item?.latitude && item?.longitude
                            ? `${parseFloat(item.latitude).toFixed(2)}, ${parseFloat(item.longitude).toFixed(2)}`
                            : "—"}
                        </span>
                      </td>

                      {/* IP */}
                      <td className="py-4 px-3">
                        <span className="text-xs text-slate-500 font-mono">
                          {item?.ipAddress || "—"}
                        </span>
                      </td>

                      {/* Region */}
                      <td className="py-4 px-3">
                        <span className="text-sm text-slate-300">
                          {item?.region || "—"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-3">
                        <span className="text-xs text-slate-400">{date}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3 flex items-center justify-center ">
                        <span
                          className={`px-2 py-1 rounded-full w-full text-xs font-medium border ${
                            item.status?.toLowerCase() === "read"
                              ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/30"
                              : "bg-amber-500/15 text-amber-300 border-amber-400/30"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {item.status?.toLowerCase() === "read" ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {item.status}
                          </div>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-3 ">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewMessage(item?.id)}
                            className="p-2 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:from-cyan-500/50 hover:to-blue-500/50 hover:text-white transition-all duration-300 hover:scale-110"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteIds(item?.id)}
                            className="p-2 rounded-lg bg-gradient-to-r from-rose-600/30 to-red-600/30 border border-rose-500/40 text-rose-300 hover:from-rose-500/50 hover:to-red-500/50 hover:text-white transition-all duration-300 hover:scale-110"
                            title="Delete"
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
                  <td colSpan={15} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                        <Mail className="w-8 h-8 text-cyan-400" />
                      </div>
                      <p className="text-slate-400 text-lg">
                        No messages found
                      </p>
                      <p className="text-slate-500 text-sm">
                        Messages will appear here when users contact you
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(CMTable);
