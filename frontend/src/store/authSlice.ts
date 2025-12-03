import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type UserRole = 'admin'; 

interface AuthState {
    token: string | null;
    user: {
        id: string;
        email: string;
        role: UserRole;
    } | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setAuthError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        setCredentials(state, action: PayloadAction<{ token: string; user: AuthState['user'] }>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            localStorage.setItem('admin_token', action.payload.token || ''); 
        },
        logout(state) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('admin_token');
        },
    },
});

export const { 
    setAuthLoading, 
    setAuthError, 
    setCredentials, 
    logout 
} = authSlice.actions;

export default authSlice.reducer;