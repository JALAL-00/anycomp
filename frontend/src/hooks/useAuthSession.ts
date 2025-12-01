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

        if (token) {
            dispatch(setCredentials({
                token,
                user: {
                    id: 'local_user',
                    email: 'admin@stcomp.com',
                    role: 'admin'
                }
            }));
        } else {
            dispatch(logout());
        }
        setSessionChecked(true);
    }, [dispatch]);

    return isSessionChecked;
}