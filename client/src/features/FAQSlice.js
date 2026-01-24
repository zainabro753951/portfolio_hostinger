import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  FAQs: [],
  FAQ: {},
  isLoading: false,
}

export const FAQSlice = createSlice({
  name: 'FAQs',
  initialState,
  reducers: {
    addFAQs: (state, action) => {
      const { isLoading, faqs } = action.payload

      // 🔹 Always update isLoading first (important for UI sync)
      if (typeof isLoading === 'boolean') {
        state.isLoading = isLoading
      }

      // 🔹 Only update data when loading completes (isLoading === false)
      if (!isLoading && faqs) {
        state.FAQs = faqs
      }
    },

    // 🔹 Find FAQ by ID
    FAQFindById: (state, action) => {
      const faqId = action.payload
      const found = state.FAQs.find(p => p.id === faqId)
      state.FAQ = found || null
    },

    // 🔹 Clear selected experience
    clearFAQ: state => {
      state.FAQ = null
    },
  },
})

export default FAQSlice.reducer
export const { addFAQs, clearFAQ, FAQFindById } = FAQSlice.actions
