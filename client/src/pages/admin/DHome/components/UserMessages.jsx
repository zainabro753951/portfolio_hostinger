import React, { memo, useMemo, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reply, MessageCircle, CheckCircle2, Clock, Mail } from "lucide-react";
import {
  contactMsgFindById,
  openReplyModal,
} from "../../../../features/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import { glassToast } from "../../Components/ToastMessage";

// Memoized message item component for better performance
const MessageItem = memo(({ msg, index, onReply, prefersReducedMotion }) => {
  const isReplied = msg?.status?.toLowerCase() === "replied";
  const isRead = msg?.status?.toLowerCase() === "read";

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -20, y: 10 },
      show: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: index * 0.08,
        },
      },
    }),
    [index],
  );

  const hoverAnimation = prefersReducedMotion
    ? {}
    : {
        x: 4,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        transition: { duration: 0.2 },
      };

  const getStatusIcon = () => {
    if (isReplied) return <CheckCircle2 className="w-3 h-3" />;
    if (isRead) return <Mail className="w-3 h-3" />;
    return <Clock className="w-3 h-3" />;
  };

  const getStatusStyles = () => {
    if (isReplied)
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (isRead) return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  };

  return (
    <motion.li
      variants={itemVariants}
      initial="hidden"
      animate="show"
      whileHover={hoverAnimation}
      className="group flex justify-between items-start gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-all duration-300"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle className="w-4 h-4 text-slate-500" />
          <p className="font-semibold text-white text-base truncate">
            {msg.fullName}
          </p>
        </div>
        <p className="text-slate-400 text-sm mb-1">{msg.email}</p>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
          {msg.message}
        </p>
      </div>

      <div className="flex-shrink-0">
        {!isReplied ? (
          <motion.button
            onClick={() => onReply(msg.id)}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/10 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 text-sm font-medium"
          >
            <Reply className="w-4 h-4" />
            Reply
          </motion.button>
        ) : (
          <div className="py-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}
            >
              {getStatusIcon()}
              {msg.status}
            </span>
          </div>
        )}
      </div>
    </motion.li>
  );
});

MessageItem.displayName = "MessageItem";

const EmptyState = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-12 text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
      <Mail className="w-8 h-8 text-slate-600" />
    </div>
    <p className="text-slate-500 text-sm">No messages yet</p>
  </motion.div>
));

EmptyState.displayName = "EmptyState";

const UserMessages = () => {
  const dispatch = useDispatch();
  const { allContactMessages } = useSelector((state) => state.contactMessages);
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.08,
          delayChildren: 0.1,
        },
      },
    }),
    [],
  );

  const handleReply = useCallback(
    (id) => {
      dispatch(contactMsgFindById(id));
      dispatch(openReplyModal());
    },
    [dispatch],
  );

  const hasMessages = allContactMessages?.length > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-violet-400 border border-violet-500/20">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-lg font-bold tracking-tight">
              User Messages
            </h4>
            <p className="text-slate-400 text-sm">
              {hasMessages
                ? `${allContactMessages.length} messages`
                : "No new messages"}
            </p>
          </div>
        </div>
      </header>

      {/* Messages List */}
      <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {hasMessages ? (
          <ul className="flex flex-col gap-3">
            {allContactMessages.map((msg, idx) => (
              <MessageItem
                key={msg.id || idx}
                msg={msg}
                index={idx}
                onReply={handleReply}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </ul>
        ) : (
          <EmptyState />
        )}
      </div>
    </motion.div>
  );
};

export default memo(UserMessages);
