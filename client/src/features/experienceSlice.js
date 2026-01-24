import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  experiences: [],
  experience: {},
  isLoading: false,
}

export const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    addExp: (state, action) => {
      const { isLoading, experiences } = action.payload

      // 🔹 Always update isLoading first (important for UI sync)
      if (typeof isLoading === 'boolean') {
        state.isLoading = isLoading
      }

      // 🔹 Only update data when loading completes (isLoading === false)
      if (!isLoading && experiences) {
        state.experiences = experiences
      }
    },

    // 🔹 Find Experience by ID
    expFindById: (state, action) => {
      const expId = action.payload
      const found = state.experiences.find(p => p.id === expId)
      state.experience = found || null
    },

    // 🔹 Clear selected experience
    clearExp: state => {
      state.experience = null
    },
  },
})

export default experienceSlice.reducer
export const { addExp, expFindById, clearExp } = experienceSlice.actions
