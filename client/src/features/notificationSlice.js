import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: [],
  notiCounts: 0,
}

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addAllNotifications: (state, action) => {
      state.notifications = action.payload?.memoizedNotis
      state.notiCounts = action.payload?.memoizedNotiCounts
    },
  },
})

export default notificationSlice.reducer

export const { addAllNotifications } = notificationSlice.actions
