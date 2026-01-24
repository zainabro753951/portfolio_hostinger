import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  allMsgsCount: 0,
  currentPageMsgsCounts: 0,
  totalPages: 0,
  currentPage: 0,
  contactCurrentMessages: [],
  allContactMessages: [],
  viewMessage: null,
  newMessagesCount: 0,
  unreadMessagesCount: 0,
  selectedIds: [],
}

export const contactMessageSlice = createSlice({
  name: 'contactMessages',
  initialState,
  reducers: {
    addContactMessages: (state, action) => {
      // ✅ Handle loading state first
      if (action.payload?.isLoading !== undefined) {
        state.isLoading = action.payload.isLoading
      }

      // ✅ If no payload data (only loading), stop here
      if (!action.payload || action.payload.isLoading || !action.payload.memoizedMessage) return

      const {
        memoizedAllEntriesCount,
        memoizedMessage = [],
        memoizedCurrentMsgCount,
        memoizedTotalMsgPages,
        memoizedCurrentPage,
      } = action.payload

      // ✅ Update counts and pagination
      state.allMsgsCount = memoizedAllEntriesCount || 0
      state.currentPageMsgsCounts = memoizedCurrentMsgCount || 0
      state.totalPages = memoizedTotalMsgPages || 0
      state.currentPage = memoizedCurrentPage || 1

      // ✅ Store messages
      state.contactCurrentMessages = memoizedMessage
      state.allContactMessages = memoizedMessage

      // ✅ Count new & unread messages
      const HOURS = 12
      const TIME_WINDOW = HOURS * 60 * 60 * 1000

      const newCount = memoizedMessage.filter(m => {
        const createdAt = new Date(m.createdAt)
        return Date.now() - createdAt.getTime() <= TIME_WINDOW
      }).length

      const unreadCount = memoizedMessage.filter(m => m.status === 'unread').length

      state.newMessagesCount = newCount
      state.unreadMessagesCount = unreadCount
    },

    contactMsgFindById: (state, action) => {
      const contactMsgId = action.payload
      const found = state.contactCurrentMessages.find(cm => cm?.id === contactMsgId)
      state.viewMessage = found || null
    },

    selectAllMessages: (state, action) => {
      const checked = action.payload
      state.contactCurrentMessages = state.contactCurrentMessages.map(m => ({
        ...m,
        selected: checked,
      }))
    },

    toggleSelectMessage: (state, action) => {
      const id = action.payload
      state.contactCurrentMessages = state.contactCurrentMessages.map(m =>
        m?.id === id ? { ...m, selected: !m.selected } : m
      )
    },

    sortContactMessages: (state, action) => {
      const sortType = action.payload?.toLowerCase?.() || 'default'
      const baseList = [...state.allContactMessages]
      let sorted = [...baseList]

      switch (sortType) {
        case 'new':
          sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'read':
          sorted = baseList.filter(m => m.status === 'read')
          break
        case 'unread':
          sorted = baseList.filter(m => m.status === 'unread')
          break
        default:
          sorted = [...baseList]
          break
      }

      state.contactCurrentMessages = sorted
    },

    deleteMessage: (state, action) => {
      const { ids } = action.payload
      const deleteIds = Array.isArray(ids) ? ids : [ids]
      state.contactCurrentMessages = state.contactCurrentMessages.filter(
        msg => !deleteIds.includes(msg.id)
      )
    },

    setSelectedIds: (state, action) => {
      const id = action.payload
      if (id) {
        state.selectedIds = [id]
        return
      }
      const selectedMessages = state.contactCurrentMessages.filter(m => m.selected)
      state.selectedIds = selectedMessages.map(m => m.id)
    },

    clearViewMessage: state => {
      state.viewMessage = null
    },

    resetContactMessages: () => initialState,
  },
})

export const {
  addContactMessages,
  contactMsgFindById,
  clearViewMessage,
  selectAllMessages,
  toggleSelectMessage,
  sortContactMessages,
  deleteMessage,
  setSelectedIds,
  resetContactMessages,
} = contactMessageSlice.actions

export default contactMessageSlice.reducer
