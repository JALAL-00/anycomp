import { configureStore } from '@reduxjs/toolkit';
import specialistReducer from './specialistSlice';
import authReducer from './authSlice'; 

export const store = configureStore({
    reducer: {
        specialists: specialistReducer,
        auth: authReducer, 
    },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;