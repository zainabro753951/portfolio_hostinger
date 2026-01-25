import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isError: false,
  errorMessage: "",
  activities: [],
};

export const recentActivities = createSlice({
  name: "recentActivities",
  initialState,
  reducers: {
    fetchActivities: (state, action) => {
      const payload = action.payload || {};

      if (payload.isLoading !== undefined) state.isLoading = payload.isLoading;
      if (payload.isError !== undefined) state.isError = payload.isError;
      if (payload.errorMessage !== undefined)
        state.errorMessage = payload.errorMessage;
      if (payload.activities) {
        state.activities = Array.isArray(payload.activities)
          ? payload.activities
          : [];
      }
    },
  },
});

export const { fetchActivities } = recentActivities.actions;
export default recentActivities.reducer;
