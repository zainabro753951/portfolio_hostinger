import React, { useEffect, useState, memo, useCallback } from "react";
import { motion } from "motion/react";
import { Search, Filter, Trash2, MailCheck, Mail } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  setSelectedIds,
  sortContactMessages,
} from "../../../../features/messageSlice";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";
import { glassToast } from "../../Components/ToastMessage";
import { store } from "../../../../app/store";
import { useMarkAsRead } from "../../../../Queries/MarkAsRead";

const ContactMessageHeader = () => {
  const { setRoute, setIds, setQueryKey, setIsOpen } = useDeleteEntryContext();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Set query key for delete context
  useEffect(() => {
    setQueryKey("contactMessages");
  }, [setQueryKey]);

  // Filter change handler
  useEffect(() => {
    if (selected) {
      dispatch(sortContactMessages(selected));
    }
  }, [selected, dispatch]);

  const {
    mutate: markAsRead,
    isError,
    isSuccess,
    data,
    error,
  } = useMarkAsRead();

  // Delete handler
  const setDeleteIds = useCallback(() => {
    const state = store.getState();
    const updatedIds =
      state.contactMessages.contactCurrentMessages
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
  }, [setIds, setIsOpen, setRoute, setQueryKey]);

  // Mark as read handler
  const setMarkAsRead = useCallback(() => {
    const state = store.getState();
    const updatedIds =
      state.contactMessages.contactCurrentMessages
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
  }, [markAsRead]);

  // Toast feedback
  useEffect(() => {
    if (isSuccess && data) {
      glassToast.success(data?.message);
    }
    if (isError && error) {
      glassToast.error(
        error?.response?.data?.message || "Failed to mark as read",
      );
    }
  }, [isSuccess, isError, data, error]);

  const filterOptions = ["All", "New", "Read", "Unread"];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-[1600px] mx-auto mb-6"
    >
      <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 shadow-xl">
        {/* Top Row - Title & Description */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <Mail className="w-6 h-6 text-cyan-400" />
              Contact Messages
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              All messages submitted through your website contact form
            </p>
          </div>

          {/* Stats could go here */}
        </div>

        {/* Bottom Row - Filters & Actions */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Left Side - Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or subject..."
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="appearance-none bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer min-w-[140px]"
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={setMarkAsRead}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:from-cyan-500/50 hover:to-blue-500/50 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <MailCheck className="w-4 h-4" />
              Mark Read
            </motion.button>

            <motion.button
              onClick={setDeleteIds}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600/30 to-red-600/30 border border-rose-500/40 text-rose-300 hover:from-rose-500/50 hover:to-red-500/50 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default memo(ContactMessageHeader);
