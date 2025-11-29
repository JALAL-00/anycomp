// src/context/AuthContext.tsx (RESTORED TO CORRECT AUTH PROVIDER LOGIC)

import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { 
    setCredentials, 
    logout as reduxLogout, 
    setAuthLoading, 
    setAuthError 
} from '@/store/authSlice';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

// Matches the backend structure
interface LoginResponse {
    token: string;
    user: { id: string, email: string, role: 'admin' | 'specialist' };
}

interface AuthContextType {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    // isAuthenticated, loading, user are available via Redux store
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use the AuthContext.
 * Uses NAMED EXPORT: { useAuth }
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


/**
 * Provides the authentication state and actions to the entire application.
 * Uses NAMED EXPORT: { AuthProvider }
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter(); 

    // LOGIN Function (Remains the same)
    const login = async (email: string, password: string) => {
        dispatch(setAuthLoading(true));
        dispatch(setAuthError(null));

        try {
            const response = await api.post<LoginResponse>('/auth/login', { email, password });
            
            dispatch(setCredentials({
                token: response.data.token,
                user: response.data.user
            }));

        } catch (error: any) {
            dispatch(setAuthError(error || 'Login failed.'));
            throw error;
        }
    };
    
    // LOGOUT Function: Now handles redirection
    const handleLogout = () => {
        dispatch(reduxLogout()); 
        router.push('/login'); 
    };

    const value: AuthContextType = {
        login,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};