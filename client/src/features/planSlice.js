import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  plans: [],
  plan: {},
}

export const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    // ✅ Add or update plans with optional loading state
    addPlan: (state, action) => {
      if (action.payload?.isLoading !== undefined) {
        state.isLoading = action.payload.isLoading
      }

      // ✅ Ensure consistent structure
      if (action.payload?.plans) {
        state.plans = Array.isArray(action.payload.plans) ? action.payload.plans : []
      }
    },

    // ✅ Find a single plan by ID
    planFindById: (state, action) => {
      const planId = action.payload
      const found = state.plans.find(p => p.id === planId)
      state.plan = found || {}
    },

    // ✅ Clear the selected plan
    clearPlan: state => {
      state.plan = {}
    },

    // ✅ Reset all plans (useful on logout or refresh)
    resetPlans: () => initialState,
  },
})

export const { addPlan, planFindById, clearPlan, resetPlans } = planSlice.actions

export default planSlice.reducer
