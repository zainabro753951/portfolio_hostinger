import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  testimonials: [],
  testimonial: {},
}

export const testimonialSlice = createSlice({
  name: 'testimonial',
  initialState,
  reducers: {
    // ✅ Add or update testimonials with optional loading state
    addTesti: (state, action) => {
      if (action.payload?.isLoading !== undefined) {
        state.isLoading = action.payload.isLoading
      }

      // ✅ Ensure data structure consistency
      if (action.payload?.testimonials) {
        state.testimonials = Array.isArray(action.payload.testimonials)
          ? action.payload.testimonials
          : []
      }
    },

    // ✅ Find a single testimonial by ID
    testiFindById: (state, action) => {
      const testiId = action.payload
      const found = state.testimonials.find(t => t.id === testiId)
      state.testimonial = found || {}
    },

    // ✅ Clear selected testimonial
    clearTestimonial: state => {
      state.testimonial = {}
    },

    // ✅ Reset slice (useful on logout or refresh)
    resetTestimonials: () => initialState,
  },
})

export const { addTesti, testiFindById, clearTestimonial, resetTestimonials } =
  testimonialSlice.actions

export default testimonialSlice.reducer
