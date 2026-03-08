import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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
  MoreVertical,
} from "lucide-react";
import axios from "axios";
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
    refetchInterval: 30000, // 30 seconds mein auto-refresh
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-400">
        <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
        <p>Failed to load email history</p>
        <p className="text-sm mt-2 text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (!history?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Mail className="w-12 h-12 mb-4 opacity-50" />
        <p>No email history found</p>
        <p className="text-sm mt-2 text-center max-w-md">
          Start the conversation by sending your first reply to {email}
        </p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-green-400" />;
      case "failed":
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      case "sending":
        return <Clock className="w-3 h-3 text-yellow-400 animate-pulse" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-400 bg-green-500/10 border-green-400/20";
      case "failed":
        return "text-red-400 bg-red-500/10 border-red-400/20";
      case "sending":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-400/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-400/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-white">
            Conversation History
          </h4>
          <p className="text-sm text-gray-400 mt-1">
            {history.length} email{history.length !== 1 ? "s" : ""} exchanged
            with {email}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            Sent
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            Received
          </span>
        </div>
      </div>

      <div className="relative space-y-6">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/20 via-purple-400/20 to-transparent" />

        <AnimatePresence>
          {history.map((email, idx) => {
            const isSent = email.type === "sent";
            const Icon = isSent ? Send : Reply;

            return (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, x: isSent ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex gap-4 ${
                  isSent ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div
                  className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border ${
                    isSent
                      ? "bg-cyan-500/20 border-cyan-400/30 text-cyan-400"
                      : "bg-purple-500/20 border-purple-400/30 text-purple-400"
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
                    className={`p-4 rounded-xl border ${
                      isSent
                        ? "bg-cyan-500/5 border-cyan-400/20"
                        : "bg-purple-500/5 border-purple-400/20"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white">
                            {email.subject}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 ${getStatusColor(email.status)}`}
                          >
                            {getStatusIcon(email.status)}
                            {email.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
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
                            <span className="text-green-400">
                              Opened{" "}
                              {new Date(email.openedAt).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div
                      className="text-sm text-gray-300 prose prose-invert max-w-none prose-p:mb-2 prose-p:mt-0"
                      dangerouslySetInnerHTML={{ __html: email.body }}
                    />

                    {/* Attachments */}
                    {email.attachments?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/10">
                        {email.attachments.map((att, i) => (
                          <a
                            key={i}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/30 text-xs text-cyan-300 transition-all"
                          >
                            <Paperclip className="w-3 h-3" />
                            {att.name}
                            <span className="text-gray-500">
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

export default EmailHistory;
