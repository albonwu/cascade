// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import exampleReducer from './exampleSlice';

// Combine multiple reducers here if needed
const rootReducer = combineReducers({
  example: exampleReducer, // Add other reducers here
});

// Set up Redux store
export const store = configureStore({
  reducer: rootReducer,
});

export default store;
