import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  visitorsCount: 0,
};

const visitorsSlice = createSlice({
  name: "visitorsCount",
  initialState,
  reducers: {
    addVisitorsCount: (state, action) => {
      if (action.payload?.isLoading !== undefined) {
        state.isLoading = action.payload.isLoading;
      }

      // ✅ Ensure data structure consistency
      if (action.payload?.visitorsCount) {
        state.visitorsCount = action.payload.visitorsCount;
      }
    },
  },
});

export const { addVisitorsCount } = visitorsSlice.actions;
export default visitorsSlice.reducer;
