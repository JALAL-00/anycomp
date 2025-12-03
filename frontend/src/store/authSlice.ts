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
            if (action.payload.user) {
                localStorage.setItem('admin_user', JSON.stringify(action.payload.user));
            }
        },
        logout(state) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
        },
        initializeAuth(state) {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('admin_token');
                const userStr = localStorage.getItem('admin_user');
                if (token && userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        state.token = token;
                        state.user = user;
                        state.isAuthenticated = true;
                    } catch (error) {
                        localStorage.removeItem('admin_token');
                        localStorage.removeItem('admin_user');
                    }
                }
            }
        },
    },
});

export const {
    setAuthLoading,
    setAuthError,
    setCredentials,
    logout,
    initializeAuth
} = authSlice.actions;

export default authSlice.reducer;