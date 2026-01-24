import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  services: [],
  service: {},
  isLoading: false,
}

export const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    addServices: (state, action) => {
      const { isLoading, services } = action.payload

      // 🔹 Always update isLoading first (important for UI sync)
      if (typeof isLoading === 'boolean') {
        state.isLoading = isLoading
      }

      // 🔹 Only update data when loading completes (isLoading === false)
      if (!isLoading && services) {
        state.services = services
      }
    },

    // 🔹 Find Services by ID
    serviceFindById: (state, action) => {
      const serviceId = action.payload
      const found = state.services.find(p => p.id === serviceId)
      state.service = found || null
    },

    // 🔹 Clear selected Service
    clearService: state => {
      state.service = null
    },
  },
})

export default serviceSlice.reducer
export const { addServices, serviceFindById, clearService } = serviceSlice.actions
