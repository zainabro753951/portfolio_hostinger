import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { Reply, Trash2, MailCheck, Mail } from "lucide-react";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";
import {
  setSelectedIds,
  openReplyModal,
  updateMessageStatus,
} from "../../../../features/messageSlice";
import { store } from "../../../../app/store";
import { glassToast } from "../../Components/ToastMessage";
import { useMarkAsRead } from "../../../../Queries/MarkAsRead";

const glassClass = `
  md:p-[1.5vw] sm:p-[2vw] xs:p-[3vw]
  md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
  bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
  border border-white/20 backdrop-blur-2xl
  shadow-[0_0_25px_rgba(34,211,238,0.15)]
  w-full flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]
`;

const DMessageView = () => {
  const { viewMessage } = useSelector((state) => state.contactMessages);
  const { setRoute, setIds, setQueryKey, setIsOpen } = useDeleteEntryContext();
  const dispatch = useDispatch();

  useEffect(() => {
    setQueryKey("contactMessages");
  }, [setQueryKey]);

  const setDeleteIds = async (id = null) => {
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
  };

  const {
    mutate: markAsRead,
    isError,
    isSuccess,
    data,
    error,
  } = useMarkAsRead();

  const setMarkAsRead = async (id = null) => {
    dispatch(setSelectedIds(id));
    const state = store.getState();
    const updatedIds = id
      ? [id]
      : state.contactMessages.contactCurrentMessages
          ?.filter((m) => m.selected)
          .map((m) => m.id) || [];

    if (!updatedIds.length) {
      glassToast(
        "Please select at least one message for mark as read!",
        "warning",
      );
      return;
    }

    markAsRead(updatedIds);
  };

  const handleReply = () => {
    if (!viewMessage) {
      glassToast("Please select a message to reply", "warning");
      return;
    }
    dispatch(openReplyModal());
  };

  useEffect(() => {
    if (isSuccess) {
      glassToast(data?.message, "success");
      dispatch(updateMessageStatus({ id: viewMessage?.id, status: "read" }));
    }
    if (isError) {
      glassToast(error?.response?.data?.message, "error");
    }
  }, [isSuccess, isError]);

  const fullDateTime = new Date(viewMessage?.createdAt).toLocaleString(
    "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  );

  return (
    <div className={glassClass}>
      {viewMessage ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="w-full flex xs:flex-col md:flex-row xs:gap-[3vw] sm:gap-[2vw] md:gap-0 items-center justify-between md:pb-[1vw] sm:pb-[2vw] xs:pb-[3vw] border-b border-gray-600">
            <div className="md:w-1/2">
              <h5 className="md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw] font-semibold text-white">
                {viewMessage?.fullName}
              </h5>
              <p className="md:text-[1vw] sm:text-[2vw] xs:text-[4vw] text-gray-400">
                {viewMessage?.email} • {fullDateTime}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
              {/* Reply Button - NEW */}
              <motion.button
                onClick={handleReply}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[4.5vw] bg-gradient-to-r from-green-500/30 to-emerald-500/20
                  border border-green-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]
                  md:text-[1vw] sm:text-[2vw] xs:text-[4vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] text-green-300 hover:text-green-200"
              >
                <Reply className="w-4 h-4" />
                Reply
              </motion.button>

              <motion.button
                onClick={() => setMarkAsRead(viewMessage?.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[4.5vw] bg-gradient-to-r from-cyan-500/30 to-blue-500/20
                  border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]
                  md:text-[1vw] sm:text-[2vw] xs:text-[4vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] text-cyan-300"
              >
                <MailCheck className="w-4 h-4" />
                Mark Read
              </motion.button>

              <motion.button
                onClick={() => setDeleteIds(viewMessage?.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[4.5vw] bg-gradient-to-r from-red-500/30 to-orange-500/20
                  border border-red-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]
                  md:text-[1vw] sm:text-[2vw] xs:text-[4vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] text-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </motion.button>
            </div>
          </div>

          {/* Original Message */}
          <div className="md:mt-[1vw] sm:mt-[2vw] xs:mt-[3vw]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                Original Message
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  viewMessage?.status === "read"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {viewMessage?.status}
              </span>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300 whitespace-pre-wrap">
                {viewMessage?.message}
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <span className="text-xs text-gray-500 block mb-1">Location</span>
              <span className="text-sm text-gray-300">
                {viewMessage?.city || "Unknown"},{" "}
                {viewMessage?.country || "Unknown"}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">
                IP Address
              </span>
              <span className="text-sm text-gray-300 font-mono">
                {viewMessage?.ipAddress || "Not tracked"}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">ISP</span>
              <span className="text-sm text-gray-300">
                {viewMessage?.isp || "Unknown"}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">
                Coordinates
              </span>
              <span className="text-sm text-gray-300 font-mono">
                {viewMessage?.latitude && viewMessage?.longitude
                  ? `${viewMessage.latitude}, ${viewMessage.longitude}`
                  : "Not available"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Mail className="w-12 h-12 mb-4 opacity-50" />
          <p className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw]">
            No Message Selected for Viewing
          </p>
          <p className="text-sm mt-2">
            Click on a message from the table to view details
          </p>
        </div>
      )}
    </div>
  );
};

export default DMessageView;
