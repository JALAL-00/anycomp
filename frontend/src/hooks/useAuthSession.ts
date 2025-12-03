'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '@/store/authSlice';
import { AppDispatch } from '@/store/store';

export function useAuthSession() {
    const dispatch = useDispatch<AppDispatch>();
    const [isSessionChecked, setSessionChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const userStr = localStorage.getItem('admin_user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                dispatch(setCredentials({
                    token,
                    user
                }));
            } catch (error) {
                console.error('Failed to parse user data from localStorage:', error);
                dispatch(logout());
            }
        } else {
            dispatch(logout());
        }
        setSessionChecked(true);
    }, [dispatch]);

    return isSessionChecked;
}