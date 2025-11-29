// src/components/layout/Header.tsx
'use client';

import React from 'react';
// MUI Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


/**
 * Renders the fixed header with page title and user actions.
 * NOTE: The page title logic is simplified here. In the next step, the main layout will provide it.
 */
const Header: React.FC = () => {
    // Mock current location from Figma
    const location = 'Dashboard / Services';

    return (
        <header className="flex-shrink-0 flex items-center justify-between h-16 px-8 border-b border-zinc-200 bg-white shadow-sm">
            
            {/* Left Section: Breadcrumbs / Current Location (Figma uses simple text) */}
            <div className='flex items-center space-x-1 text-sm text-zinc-500'>
                {/* Simplified Breadcrumb / Location */}
                <span className='font-medium text-text-primary'>{location}</span>
            </div>

            {/* Right Section: Icons */}
            <div className="flex items-center space-x-4">
                {/* User Name (Figma has an avatar/name) */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Gwen Lam</span>
                    <PersonIcon className="w-6 h-6 text-primary-dark" />
                </div>
                
                {/* Notifications Icon */}
                <button className="relative p-1 rounded-full text-zinc-500 hover:bg-zinc-100 transition-colors">
                    <NotificationsIcon sx={{ fontSize: 24 }} />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent-red"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;