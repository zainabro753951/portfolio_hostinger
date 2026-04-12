import React, { useEffect, memo, useCallback } from "react";
import { motion } from "motion/react";
import {
  Reply,
  Trash2,
  MailCheck,
  Mail,
  MapPin,
  Globe,
  Wifi,
  Calendar,
  Clock,
  User,
  Hash,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";
import {
  setSelectedIds,
  openReplyModal,
  updateMessageStatus,
} from "../../../../features/messageSlice";
import { store } from "../../../../app/store";
import { glassToast } from "../../Components/ToastMessage";
import { useMarkAsRead } from "../../../../Queries/MarkAsRead";

const DMessageView = () => {
  const { viewMessage } = useSelector((state) => state.contactMessages);
  const { setRoute, setIds, setQueryKey, setIsOpen } = useDeleteEntryContext();
  const dispatch = useDispatch();

  useEffect(() => {
    setQueryKey("contactMessages");
  }, [setQueryKey]);

  const {
    mutate: markAsRead,
    isError,
    isSuccess,
    data,
    error,
  } = useMarkAsRead();

  // Delete handler
  const setDeleteIds = useCallback(
    (id = null) => {
      dispatch(setSelectedIds(id));
      const state = store.getState();
      const updatedIds = id
        ? [id]
        : state.contactMessages.contactCurrentMessages
            ?.filter((m) => m.selected)
            .map((m) => m.id) || [];

      if (!updatedIds.length) {
        glassToast("Please select at least one message to delete!", "warning");
        return;
      }

      setIds(updatedIds);
      setRoute("/message/delete");
      setQueryKey("contactMessages");
      setIsOpen(true);
    },
    [dispatch, setIds, setIsOpen, setRoute, setQueryKey],
  );

  // Mark as read handler
  const setMarkAsRead = useCallback(
    (id = null) => {
      dispatch(setSelectedIds(id));
      const state = store.getState();
      const updatedIds = id
        ? [id]
        : state.contactMessages.contactCurrentMessages
            ?.filter((m) => m.selected)
            .map((m) => m.id) || [];

      if (!updatedIds.length) {
        glassToast(
          "Please select at least one message to mark as read!",
          "warning",
        );
        return;
      }

      markAsRead(updatedIds);
    },
    [dispatch, markAsRead],
  );

  // Reply handler
  const handleReply = useCallback(() => {
    if (!viewMessage) {
      glassToast("Please select a message to reply", "warning");
      return;
    }
    dispatch(openReplyModal());
  }, [viewMessage, dispatch]);

  // Toast feedback
  useEffect(() => {
    if (isSuccess && data) {
      glassToast.success(data?.message);
      dispatch(updateMessageStatus({ id: viewMessage?.id, status: "read" }));
    }
    if (isError && error) {
      glassToast.error(
        error?.response?.data?.message || "Failed to mark as read",
      );
    }
  }, [isSuccess, isError, data, error, dispatch, viewMessage]);

  // Format date
  const fullDateTime = viewMessage?.createdAt
    ? new Date(viewMessage.createdAt).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full "
    >
      <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        {viewMessage ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {viewMessage?.fullName}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                    <Mail className="w-4 h-4" />
                    {viewMessage?.email}
                    <span className="text-slate-600">•</span>
                    <Calendar className="w-4 h-4" />
                    {fullDateTime}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleReply}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-green-600/30 border border-emerald-500/40 text-emerald-300 hover:from-emerald-500/50 hover:to-green-500/50 hover:text-white transition-all duration-300 text-sm font-medium"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </motion.button>

                <motion.button
                  onClick={() => setMarkAsRead(viewMessage?.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:from-cyan-500/50 hover:to-blue-500/50 hover:text-white transition-all duration-300 text-sm font-medium"
                >
                  <MailCheck className="w-4 h-4" />
                  Mark Read
                </motion.button>

                <motion.button
                  onClick={() => setDeleteIds(viewMessage?.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600/30 to-red-600/30 border border-rose-500/40 text-rose-300 hover:from-rose-500/50 hover:to-red-500/50 hover:text-white transition-all duration-300 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Subject
                </span>
                <span className="text-white font-medium">
                  {viewMessage?.subject}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    viewMessage?.status === "read"
                      ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/30"
                      : "bg-amber-500/15 text-amber-300 border-amber-400/30"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {viewMessage?.status === "read" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {viewMessage?.status}
                  </div>
                </span>
              </div>

              <div className="p-5 rounded-xl bg-slate-800/50 border border-white/10">
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {viewMessage?.message}
                </p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <MapPin className="w-3 h-3" />
                  Location
                </div>
                <span className="text-sm text-slate-300">
                  {viewMessage?.city || "Unknown"},{" "}
                  {viewMessage?.country || "Unknown"}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Globe className="w-3 h-3" />
                  IP Address
                </div>
                <span className="text-sm text-slate-300 font-mono">
                  {viewMessage?.ipAddress || "Not tracked"}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Wifi className="w-3 h-3" />
                  ISP
                </div>
                <span className="text-sm text-slate-300">
                  {viewMessage?.isp || "Unknown"}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Hash className="w-3 h-3" />
                  Coordinates
                </div>
                <span className="text-sm text-slate-300 font-mono">
                  {viewMessage?.latitude && viewMessage?.longitude
                    ? `${parseFloat(viewMessage.latitude).toFixed(4)}, ${parseFloat(viewMessage.longitude).toFixed(4)}`
                    : "Not available"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 mb-4">
              <Mail className="w-10 h-10 text-cyan-400" />
            </div>
            <p className="text-lg font-medium text-slate-300">
              No Message Selected
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Click on a message from the table to view details
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(DMessageView);
