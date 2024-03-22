import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasAuth: false,
  username: "User",
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register(state, action) {
      state.hasAuth = true;
      state.username = action.payload.username;
    },
    logout(state) {
      state.hasAuth = false;
      state.username = "User";
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
