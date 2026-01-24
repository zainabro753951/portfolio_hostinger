import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  activities: []
}

export const recentActivities = createSlice({
  name: "recentActivities",
  initialState,
  reducers: {
    fetchActivities: (state, action) => {
       if (action.payload?.isLoading !== undefined) {
        state.isLoading = action.payload.isLoading
      }

      // If the data object is passed
      if (action.payload?.activities) {
        state.activities = Array.isArray(action.payload.activities) ? action.payload.activities : []
      }
    }
  }
})

export const { fetchActivities } = recentActivities.actions
export default recentActivities.reducer
