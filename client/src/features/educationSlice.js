import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  educations: [],
  education: {},
}

export const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    // ✅ Add or update education data with optional loading state
    addEduc: (state, action) => {
      if (action.payload?.isLoading !== undefined) {
        state.isLoading = action.payload.isLoading
      }

      // If the data object is passed
      if (action.payload?.education) {
        state.educations = Array.isArray(action.payload.education) ? action.payload.education : []
      }
    },

    // ✅ Find a single education by ID
    educFindById: (state, action) => {
      const educId = action.payload
      const found = state.educations.find(e => e.id === educId)
      state.education = found || {}
    },

    // ✅ Clear the selected education
    clearFindedEduc: state => {
      state.education = {}
    },

    // ✅ Reset the whole slice
    resetEducation: () => initialState,
  },
})

export const { addEduc, educFindById, clearFindedEduc, resetEducation } = educationSlice.actions

export default educationSlice.reducer
