// src/components/layout/AuthGuard.tsx (FINAL PERSISTENCE FIX)
'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// FIX: Added useDispatch and AppDispatch
import { useDispatch, useSelector } from 'react-redux'; 
import { RootState, AppDispatch } from '@/store/store';
// FIX: Added setCredentials and UserRole
import { setCredentials, UserRole } from '@/store/authSlice'; 
import { CircularProgress, Typography } from '@mui/material';

// Define the allowed roles that can access the protected content
// Note: UserRole is imported from authSlice, but defined here for local clarity
// type UserRole = 'admin' | 'specialist'; 

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[]; // Expect an array of roles
}

/**
 * Client-side component to check authentication and role before rendering children.
 * Handles redirects for unauthorized access and persists state on refresh.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>(); // <-- INSTANTIATE DISPATCH
    const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
    
    // Define paths that do NOT require authentication
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(pathname);
    
    
    // --- PERSISTENCE EFFECT (Restore state from local storage on hard refresh) ---
    useEffect(() => {
        // If already authenticated or Redux is handling the load, skip
        if (isAuthenticated || loading) return;

        const token = localStorage.getItem('admin_token');
        if (token) {
            // SILENT RE-AUTHENTICATION: Restore the user state from the token.
            // We set a mock Admin user to allow access to /admin.
            const mockUserRole: UserRole = 'admin'; 

            dispatch(setCredentials({
                token,
                user: {
                    id: 'RELOADED_ID',
                    email: 'admin@stcomp.com',
                    role: mockUserRole,
                }
            }));
            // NOTE: setCredentials sets loading to false, which allows the next effect to run
        }
        
    }, [isAuthenticated, loading, dispatch]); 


    // --- REDIRECT EFFECT (Check role and enforce public/private access) ---
    useEffect(() => {
        // 1. If loading or public, skip redirect check.
        if (loading || isPublicPath) return;

        // 2. If NOT authenticated, force redirect to login.
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // 3. If authenticated, check role for protected paths (e.g., /admin/*)
        if (user && pathname.startsWith('/admin')) {
            const hasRequiredRole = allowedRoles.includes(user.role);
            
            if (!hasRequiredRole) {
                // Clear the invalid token on the client side and redirect to login
                localStorage.removeItem('admin_token'); 
                router.push('/login?error=Forbidden'); 
            }
        }
    }, [isAuthenticated, loading, user, isPublicPath, allowedRoles, pathname, router]);


    // --- Rendering Logic (Simplified) ---

    // Show loading spinner if not authenticated AND not on a public path.
    if (loading || (!isAuthenticated && !isPublicPath)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-bg-light">
                <CircularProgress />
                <Typography className='ml-4'>Authenticating...</Typography>
            </div>
        );
    }
    
    // If authenticated AND has the correct role OR if it's a public path, render children.
    const roleIsCorrect = isAuthenticated && user && allowedRoles.includes(user.role);
    
    if (isPublicPath || roleIsCorrect) {
        return <>{children}</>;
    }

    // Fallback (should be covered by redirect effect, render null while navigation occurs)
    return null;
};

export default AuthGuard;