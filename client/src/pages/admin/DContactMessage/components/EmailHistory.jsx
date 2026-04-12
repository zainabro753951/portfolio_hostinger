import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Reply,
  Mail,
  Clock,
  CheckCheck,
  AlertCircle,
  Paperclip,
  User,
  Bot,
} from "lucide-react";
import api from "../../../../api/axios";

const fetchEmailHistory = async (messageId) => {
  const { data } = await api.get(`/${messageId}/email-history`);
  return data;
};

const EmailHistory = ({ messageId, email }) => {
  const {
    data: history,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["emailHistory", messageId],
    queryFn: () => fetchEmailHistory(messageId),
    enabled: !!messageId,
    refetchInterval: 30000,
  });

  // Status helpers
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-emerald-400" />;
      case "failed":
        return <AlertCircle className="w-3 h-3 text-rose-400" />;
      case "sending":
        return <Clock className="w-3 h-3 text-amber-400 animate-pulse" />;
      default:
        return <Clock className="w-3 h-3 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-400/20";
      case "failed":
        return "text-rose-400 bg-rose-500/10 border-rose-400/20";
      case "sending":
        return "text-amber-400 bg-amber-500/10 border-amber-400/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-400/20";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-rose-400">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <p className="text-lg font-medium">Failed to load email history</p>
        <p className="text-sm mt-2 text-slate-500">{error.message}</p>
      </div>
    );
  }

  // Empty state
  if (!history?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-cyan-400" />
        </div>
        <p className="text-lg font-medium text-slate-300">
          No email history found
        </p>
        <p className="text-sm mt-2 text-center max-w-md text-slate-500">
          Start the conversation by sending your first reply to {email}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            Conversation History
          </h4>
          <p className="text-sm text-slate-400 mt-1">
            {history.length} email{history.length !== 1 ? "s" : ""} exchanged
            with {email}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            Sent
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            Received
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/30 via-purple-400/30 to-transparent" />

        <AnimatePresence>
          {history.map((email, idx) => {
            const isSent = email.type === "sent";

            return (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, x: isSent ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className={`relative flex gap-4 ${isSent ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div
                  className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    isSent
                      ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-400"
                      : "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-400"
                  }`}
                >
                  {isSent ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>

                {/* Content Card */}
                <div className={`flex-1 ${isSent ? "mr-12" : "ml-12"}`}>
                  <div
                    className={`p-4 sm:p-5 rounded-xl border backdrop-blur-sm ${
                      isSent
                        ? "bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-400/20"
                        : "bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-400/20"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white truncate">
                            {email.subject}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 ${getStatusColor(email.status)}`}
                          >
                            {getStatusIcon(email.status)}
                            {email.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(email.sentAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {email.openedAt && (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCheck className="w-3 h-3" />
                              Opened{" "}
                              {new Date(email.openedAt).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div
                      className="text-sm text-slate-300 prose prose-invert max-w-none prose-p:mb-2 prose-p:mt-0 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: email.body }}
                    />

                    {/* Attachments */}
                    {email.attachments?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                        {email.attachments.map((att, i) => (
                          <a
                            key={i}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/30 text-xs text-cyan-300 transition-all"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span className="max-w-[120px] truncate">
                              {att.name}
                            </span>
                            <span className="text-slate-500">
                              ({(att.size / 1024).toFixed(1)} KB)
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(EmailHistory);
