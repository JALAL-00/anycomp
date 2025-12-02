'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Box, CircularProgress } from '@mui/material';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && !isAuthenticated && pathname !== '/login') {
            router.push('/login');
        }
    }, [isClient, isAuthenticated, pathname, router]);

    if (!isClient) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (!isAuthenticated && pathname !== '/login') {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    return <>{children}</>;
}