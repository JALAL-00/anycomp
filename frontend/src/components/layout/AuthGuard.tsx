// src/components/layout/AuthGuard.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setCredentials, UserRole } from '@/store/authSlice';
import { CircularProgress, Typography } from '@mui/material';

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
    
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(pathname);

    useEffect(() => {
        if (isAuthenticated || loading) return;
        const token = localStorage.getItem('admin_token');
        if (token) {
            const mockUserRole: UserRole = 'admin';
            dispatch(setCredentials({
                token,
                user: {
                    id: 'RELOADED_ID',
                    email: 'admin@stcomp.com',
                    role: mockUserRole
                }
            }));
        }
    }, [isAuthenticated, loading, dispatch]);

    useEffect(() => {
        if (loading || isPublicPath) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (user && pathname.startsWith('/admin')) {
            const hasRequiredRole = allowedRoles.includes(user.role);
            if (!hasRequiredRole) {
                localStorage.removeItem('admin_token');
                router.push('/login?error=Forbidden');
            }
        }
    }, [isAuthenticated, loading, user, isPublicPath, allowedRoles, pathname, router]);

    if (loading || (!isAuthenticated && !isPublicPath)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-bg-light">
                <CircularProgress />
                <Typography className='ml-4'>Authenticating...</Typography>
            </div>
        );
    }

    const roleIsCorrect = isAuthenticated && user && allowedRoles.includes(user.role);

    if (isPublicPath || roleIsCorrect) {
        return <>{children}</>;
    }

    return null;
};

export default AuthGuard;
