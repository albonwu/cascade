// store/exampleSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  value: "start",
};

// Create a slice
const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    toHome: (state) => {
      state.value = "home"
    },
    toStart: (state) => {
      state.value = "start"
    },
  },
});

// Export actions
export const { toHome, toStart } = exampleSlice.actions;

// Export the reducer
export default exampleSlice.reducer;
