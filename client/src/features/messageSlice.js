import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  allMsgsCount: 0,
  currentPageMsgsCounts: 0,
  totalPages: 0,
  currentPage: 0,
  contactCurrentMessages: [],
  allContactMessages: [],
  viewMessage: null,
  isReplyModalOpen: false, // ✅ Naya: Reply modal state
  newMessagesCount: 0,
  unreadMessagesCount: 0,
  selectedIds: [],
};

// ==================== THUNKS ====================

// Send reply thunk
export const sendReply = createAsyncThunk(
  "contactMessages/sendReply",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/messages/reply", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to send reply");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// ==================== SLICE ====================

export const contactMessageSlice = createSlice({
  name: "contactMessages",
  initialState,
  reducers: {
    // ✅ Aapka existing code (unchanged)
    addContactMessages: (state, action) => {
      if (action.payload?.isLoading !== undefined) {
        state.loading = action.payload.isLoading;
      }

      if (
        !action.payload ||
        action.payload.isLoading ||
        !action.payload.memoizedMessage
      )
        return;

      const {
        memoizedAllEntriesCount,
        memoizedMessage = [],
        memoizedCurrentMsgCount,
        memoizedTotalMsgPages,
        memoizedCurrentPage,
      } = action.payload;

      state.allMsgsCount = memoizedAllEntriesCount || 0;
      state.currentPageMsgsCounts = memoizedCurrentMsgCount || 0;
      state.totalPages = memoizedTotalMsgPages || 0;
      state.currentPage = memoizedCurrentPage || 1;

      state.contactCurrentMessages = memoizedMessage;
      state.allContactMessages = memoizedMessage;

      const HOURS = 12;
      const TIME_WINDOW = HOURS * 60 * 60 * 1000;

      const newCount = memoizedMessage.filter((m) => {
        const createdAt = new Date(m.createdAt);
        return Date.now() - createdAt.getTime() <= TIME_WINDOW;
      }).length;

      const unreadCount = memoizedMessage.filter(
        (m) => m.status === "unread",
      ).length;

      state.newMessagesCount = newCount;
      state.unreadMessagesCount = unreadCount;
    },

    // ✅ Aapka existing code (unchanged)
    contactMsgFindById: (state, action) => {
      const contactMsgId = action.payload;
      const found = state.contactCurrentMessages.find(
        (cm) => cm?.id === contactMsgId,
      );
      state.viewMessage = found || null;
    },

    // ✅ Aapka existing code (unchanged)
    selectAllMessages: (state, action) => {
      state.contactCurrentMessages = state.contactCurrentMessages.map(
        (msg) => ({
          ...msg,
          selected: action.payload,
        }),
      );
    },

    // ✅ Aapka existing code (unchanged)
    toggleSelectMessage: (state, action) => {
      const message = state.contactCurrentMessages.find(
        (m) => m.id === action.payload,
      );
      if (message) {
        message.selected = !message.selected;
      }
    },

    // ✅ Aapka existing code (unchanged)
    sortContactMessages: (state, action) => {
      const filter = action.payload.toLowerCase();
      if (filter === "all") {
        return;
      }
      state.contactCurrentMessages = state.contactCurrentMessages.filter(
        (msg) => msg.status.toLowerCase() === filter,
      );
    },

    // ✅ Aapka existing code (unchanged)
    deleteMessage: (state, action) => {
      const idsToDelete = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      state.contactCurrentMessages = state.contactCurrentMessages.filter(
        (msg) => !idsToDelete.includes(msg.id),
      );

      state.allMsgsCount = state.contactCurrentMessages.length;
      state.unreadMessagesCount = state.contactCurrentMessages.filter(
        (m) => m.status === "unread",
      ).length;
      state.newMessagesCount = state.contactCurrentMessages.filter(
        (m) => m.status === "new",
      ).length;

      if (state.viewMessage && idsToDelete.includes(state.viewMessage.id)) {
        state.viewMessage = null;
      }
    },

    // ✅ Aapka existing code (unchanged)
    setSelectedIds: (state, action) => {
      if (action.payload) {
        const msg = state.contactCurrentMessages.find(
          (m) => m.id === action.payload,
        );
        if (msg) msg.selected = true;
      }
    },

    // ✅ Aapka existing code (unchanged)
    clearViewMessage: (state) => {
      state.viewMessage = null;
    },

    // ✅ Aapka existing code (unchanged)
    resetContactMessages: () => initialState,

    // ==================== 🆕 NAYA: REPLY FEATURE REDUCERS ====================

    // Reply Modal Reducers
    openReplyModal: (state) => {
      state.isReplyModalOpen = true;
    },

    closeReplyModal: (state) => {
      state.isReplyModalOpen = false;
    },

    // Message status update (Mark as read, etc.)
    updateMessageStatus: (state, action) => {
      const { id, status } = action.payload;
      const message = state.contactCurrentMessages.find((m) => m.id === id);
      if (message) {
        message.status = status;
      }
      if (state.viewMessage?.id === id) {
        state.viewMessage.status = status;
      }
    },

    // Reply history add karna
    addReplyToHistory: (state, action) => {
      const { messageId, reply } = action.payload;
      const message = state.contactCurrentMessages.find(
        (m) => m.id === messageId,
      );
      if (message) {
        if (!message.replies) message.replies = [];
        message.replies.unshift(reply);
        message.status = "replied";
        message.lastRepliedAt = new Date().toISOString();
      }
      if (state.viewMessage?.id === messageId) {
        if (!state.viewMessage.replies) state.viewMessage.replies = [];
        state.viewMessage.replies.unshift(reply);
        state.viewMessage.status = "replied";
        state.viewMessage.lastRepliedAt = new Date().toISOString();
      }
    },

    // Real-time new message add karna
    addNewMessage: (state, action) => {
      state.contactCurrentMessages.unshift({
        ...action.payload,
        selected: false,
      });
      state.allMsgsCount += 1;
      state.currentPageMsgsCounts += 1;
      if (action.payload.status === "unread") {
        state.unreadMessagesCount += 1;
      }
      if (action.payload.status === "new") {
        state.newMessagesCount += 1;
      }
    },

    // Existing message update karna
    updateMessage: (state, action) => {
      const index = state.contactCurrentMessages.findIndex(
        (m) => m.id === action.payload.id,
      );
      if (index !== -1) {
        state.contactCurrentMessages[index] = {
          ...state.contactCurrentMessages[index],
          ...action.payload,
        };
        if (state.viewMessage?.id === action.payload.id) {
          state.viewMessage = {
            ...state.viewMessage,
            ...action.payload,
          };
        }
      }
    },

    // Selected IDs array manage karna (bulk operations ke liye)
    setSelectedIdsArray: (state, action) => {
      state.selectedIds = action.payload;
    },

    clearSelectedIds: (state) => {
      state.selectedIds = [];
    },

    // Loading state manually set karna (agar zaroorat ho)
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Error state manually set karna
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },

  // ==================== EXTRA REDUCERS (Thunks ke liye) ====================
  extraReducers: (builder) => {
    builder
      // Send Reply Pending
      .addCase(sendReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Send Reply Fulfilled
      .addCase(sendReply.fulfilled, (state, action) => {
        state.loading = false;
        // Message status update karo
        const { originalMessageId } = action.meta.arg;
        const message = state.contactCurrentMessages.find(
          (m) => m.id === originalMessageId,
        );
        if (message) {
          message.status = "replied";
          message.lastRepliedAt = new Date().toISOString();
          message.replyCount = (message.replyCount || 0) + 1;
        }
        if (state.viewMessage?.id === originalMessageId) {
          state.viewMessage.status = "replied";
          state.viewMessage.lastRepliedAt = new Date().toISOString();
          state.viewMessage.replyCount =
            (state.viewMessage.replyCount || 0) + 1;
        }
      })
      // Send Reply Rejected
      .addCase(sendReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ==================== EXPORTS ====================

export const {
  // Existing exports
  addContactMessages,
  contactMsgFindById,
  clearViewMessage,
  selectAllMessages,
  toggleSelectMessage,
  sortContactMessages,
  deleteMessage,
  setSelectedIds,
  resetContactMessages,

  // 🆕 Naye exports (Reply Feature)
  openReplyModal,
  closeReplyModal,
  updateMessageStatus,
  addReplyToHistory,
  addNewMessage,
  updateMessage,
  setSelectedIdsArray,
  clearSelectedIds,
  setLoading,
  setError,
  clearError,
} = contactMessageSlice.actions;

// Selectors (optional but useful)
export const selectSelectedMessages = (state) =>
  state.contactMessages.contactCurrentMessages.filter((m) => m.selected);

export const selectMessageById = (state, id) =>
  state.contactMessages.contactCurrentMessages.find((m) => m.id === id);

export const selectUnreadCount = (state) =>
  state.contactMessages.unreadMessagesCount;

export const selectNewCount = (state) => state.contactMessages.newMessagesCount;

export default contactMessageSlice.reducer;
