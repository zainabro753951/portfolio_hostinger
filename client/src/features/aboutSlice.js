import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  data: {}, // ✅ renamed 'about' → 'data' for consistent structure
}

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    addAbout: (state, action) => {
      const { isLoading, about } = action.payload

      // 🔹 Always update isLoading first (important for UI sync)
      if (typeof isLoading === 'boolean') {
        state.isLoading = isLoading
      }

      // 🔹 Only update data when loading completes (isLoading === false)
      if (!isLoading && about) {
        state.data = about
      }
    },
  },
})

export const { addAbout } = aboutSlice.actions
export default aboutSlice.reducer
