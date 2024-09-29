// store/exampleSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  value: "start",
  sessionId: "",
};

// Create a slice
const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    toHome: (state) => {
      state.value = "home";
    },
    toStart: (state) => {
      state.value = "start";
    },
    toEnd: (state, sessionId) => {
      state.value = "end";
      state.sessionId = sessionId;
    },
  },
});

// Export actions
export const { toHome, toStart, toEnd } = exampleSlice.actions;

// Export the reducer
export default exampleSlice.reducer;
