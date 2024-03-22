import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isDrawerOpen: false,
};

const roomSlice = createSlice({
  name: "roomSlice",
  initialState,
  reducers: {
    setIsDrawerOpen(state, action) {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const roomActions = roomSlice.actions;
export default roomSlice.reducer;
