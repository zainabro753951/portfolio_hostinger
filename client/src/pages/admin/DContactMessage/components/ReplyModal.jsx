import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  Send,
  Paperclip,
  History,
  ChevronDown,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import EmailEditor from "./EmailEditor";
import EmailHistory from "./EmailHistory";
import TemplateSelector from "./TemplateSelector";
import { useSendReply } from "../../../../Queries/SendReply";
import { glassToast } from "../../Components/ToastMessage";
import { closeReplyModal } from "../../../../features/messageSlice";

const ReplyModal = () => {
  const dispatch = useDispatch();
  const { viewMessage, isReplyModalOpen } = useSelector(
    (state) => state.contactMessages,
  );

  const {
    mutate: sendReply,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useSendReply();

  const [activeTab, setActiveTab] = useState("compose");
  const [showTemplates, setShowTemplates] = useState(false);

  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
    attachments: [],
  });

  // ✅ FIX: Use ref to prevent cursor jumping - store editor content separately
  const editorContentRef = useRef("");
  const isInitialMount = useRef(true);

  // ✅ FIX: Memoized default reply generator
  const generateDefaultReply = useCallback((msg) => {
    if (!msg) return "";

    return `Dear ${msg.fullName || "Customer"},

Thank you for contacting us regarding "${msg.subject || "your inquiry"}".

${
  msg.message
    ? `\nYour message:\n"${msg.message.substring(0, 200)}${
        msg.message.length > 200 ? "..." : ""
      }"\n`
    : ""
}

We have received your inquiry and would like to assist you further.

[Type your response here...]

Best regards,
Support Team`;
  }, []);

  // ✅ FIX: Initialize form when modal opens - only once
  useEffect(() => {
    if (viewMessage && isReplyModalOpen && isInitialMount.current) {
      const defaultBody = generateDefaultReply(viewMessage);

      setEmailData({
        to: viewMessage.email || "",
        subject: `Re: ${viewMessage.subject || ""}`,
        body: defaultBody,
        attachments: [],
      });

      // ✅ IMPORTANT: Set editor ref content
      editorContentRef.current = defaultBody;
      isInitialMount.current = false;
      setActiveTab("compose");
      setShowTemplates(false);
    }
  }, [viewMessage, isReplyModalOpen, generateDefaultReply]);

  // ✅ FIX: Reset initial mount when modal closes
  useEffect(() => {
    if (!isReplyModalOpen) {
      isInitialMount.current = true;
      editorContentRef.current = "";
    }
  }, [isReplyModalOpen]);

  // ✅ FIX: Debounced body update to prevent cursor jumping
  const handleBodyChange = useCallback((newBody) => {
    editorContentRef.current = newBody;

    // Use functional update to prevent stale closures
    setEmailData((prev) => {
      // Only update if actually changed to prevent unnecessary re-renders
      if (prev.body === newBody) return prev;
      return { ...prev, body: newBody };
    });
  }, []);

  const handleSend = async () => {
    const currentBody = editorContentRef.current || emailData.body;

    if (
      !currentBody.trim() ||
      currentBody.includes("[Type your response here...]") ||
      currentBody.replace(/\\s/g, "").length < 10
    ) {
      glassToast("Please enter a proper message", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("to", emailData.to);
    formData.append("subject", emailData.subject);
    formData.append("body", currentBody);
    formData.append("originalMessageId", viewMessage?.id);

    emailData.attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    sendReply(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      glassToast("Reply sent successfully!", "success");
      dispatch(closeReplyModal());
      // Reset state
      setEmailData({
        to: "",
        subject: "",
        body: "",
        attachments: [],
      });
      editorContentRef.current = "";
      isInitialMount.current = true;
    }
    if (isError) {
      glassToast(
        error?.response?.data?.message || "Failed to send reply",
        "error",
      );
    }
  }, [isSuccess, isError]);

  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = emailData.attachments.length + files.length;

    if (totalFiles > 5) {
      glassToast("Maximum 5 files allowed", "warning");
      return;
    }

    // File size check (10MB each)
    const oversized = files.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      glassToast("Files must be less than 10MB each", "warning");
      return;
    }

    setEmailData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index) => {
    setEmailData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const applyTemplate = (template) => {
    const newContent = template.content
      .replace(/{{name}}/g, viewMessage?.fullName || "Customer")
      .replace(/{{subject}}/g, viewMessage?.subject || "")
      .replace(/{{date}}/g, new Date().toLocaleDateString());

    // ✅ FIX: Update both ref and state
    editorContentRef.current = newContent;
    setEmailData((prev) => ({ ...prev, body: newContent }));
    setShowTemplates(false);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isReplyModalOpen) {
        dispatch(closeReplyModal());
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isReplyModalOpen, dispatch]);

  if (!isReplyModalOpen || !viewMessage) return null;

  // ✅ FIX: Proper Portal structure with AnimatePresence inside
  return createPortal(
    <AnimatePresence mode="wait">
      {isReplyModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => dispatch(closeReplyModal())}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#0a0a2a]/95 to-[#101040]/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(34,211,238,0.3)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Send className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Reply to Message
                  </h3>
                  <p className="text-sm text-cyan-300/70">
                    To: {viewMessage.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex p-1 rounded-lg bg-white/5 border border-white/10">
                  <button
                    onClick={() => setActiveTab("compose")}
                    className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                      activeTab === "compose"
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Compose
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                      activeTab === "history"
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    History
                  </button>
                </div>

                <button
                  onClick={() => dispatch(closeReplyModal())}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {activeTab === "compose" ? (
                <div className="space-y-4">
                  {/* Templates */}
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      Templates
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          showTemplates ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showTemplates && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <TemplateSelector onSelect={applyTemplate} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-300">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailData.subject}
                      onChange={(e) =>
                        setEmailData((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    />
                  </div>

                  {/* Editor */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-300">
                      Message
                    </label>
                    {/* ✅ FIX: Pass ref content and custom handler */}
                    <EmailEditor
                      key={viewMessage?.id || "editor"} // Force remount on message change
                      initialValue={emailData.body}
                      onChange={handleBodyChange}
                      placeholder="Type your reply here..."
                    />
                  </div>

                  {/* Attachments */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-300">
                      Attachments
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {emailData.attachments.map((file, idx) => (
                        <motion.div
                          key={`${file.name}-${idx}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-sm text-cyan-300"
                        >
                          <Paperclip className="w-4 h-4" />
                          <span className="max-w-[150px] truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                          <button
                            onClick={() => removeAttachment(idx)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}

                      {emailData.attachments.length < 5 && (
                        <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/10 cursor-pointer transition-all">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-sm">Add File</span>
                          <input
                            type="file"
                            multiple
                            onChange={handleAttachment}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.zip"
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Max 5 files. Supported: PDF, DOC, Images (Max 10MB each)
                    </p>
                  </div>
                </div>
              ) : (
                <EmailHistory
                  messageId={viewMessage?.id}
                  email={viewMessage?.email}
                />
              )}
            </div>

            {/* Footer */}
            {activeTab === "compose" && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-cyan-400/20 bg-white/5">
                <div className="text-sm text-gray-400">
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    `${(editorContentRef.current || emailData.body).length} characters`
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => dispatch(closeReplyModal())}
                    className="px-6 py-2.5 rounded-xl text-gray-300 hover:bg-white/10 transition-all"
                    disabled={isPending}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSend}
                    disabled={isPending}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Reply
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ReplyModal;
