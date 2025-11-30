// src/context/AuthContext.tsx (FINAL CORRECTED CODE)

import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { 
    setCredentials, 
    logout as reduxLogout, 
    setAuthLoading, 
    setAuthError,
    UserRole // <-- Import UserRole from slice to keep types synched
} from '@/store/authSlice';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

// Matches the backend structure, uses the role from the slice
interface LoginResponse {
    token: string;
    // FIX: Changed role to only reference the correct UserRole type from the slice
    user: { id: string, email: string, role: UserRole }; 
}

interface AuthContextType {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter(); 

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