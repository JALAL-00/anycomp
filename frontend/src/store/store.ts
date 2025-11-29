// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import specialistReducer from './specialistSlice';

// Configure the store
export const store = configureStore({
    reducer: {
        specialists: specialistReducer,
        // Add other reducers here (e.g., auth)
    },
    // Optional: Dev tools are automatically included in development
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;