// src/components/layout/Header.tsx (FULL CORRECTED CODE with Logout)
'use client';

import React, { useState } from 'react';
// MUI Icons and Components
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
// FIX: Changed to NAMED IMPORT { useAuth }
import { useAuth } from '@/context/AuthContext'; 
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';


/**
 * Renders the fixed header with page title and user actions, including Logout.
 */
const Header: React.FC = () => {
    const { logout } = useAuth(); // <-- Get logout function
    const { user } = useSelector((state: RootState) => state.auth);
    
    // MUI Menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout(); // Call the logout function from AuthContext
        handleClose();
    };
    
    // Mock current location from Figma
    const location = 'Dashboard / Services';

    return (
        <header className="flex-shrink-0 flex items-center justify-between h-16 px-8 border-b border-zinc-200 bg-white shadow-sm">
            
            {/* Left Section: Breadcrumbs / Current Location */}
            <div className='flex items-center space-x-1 text-sm text-zinc-500'>
                <span className='font-medium text-text-primary'>{location}</span>
            </div>

            {/* Right Section: Icons and User Menu */}
            <div className="flex items-center space-x-4">
                
                {/* User Name */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{user?.email.split('@')[0] || 'User'}</span>
                </div>
                
                {/* Notifications Icon */}
                <button className="relative p-1 rounded-full text-zinc-500 hover:bg-zinc-100 transition-colors">
                    <NotificationsIcon sx={{ fontSize: 24 }} />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent-red"></span>
                </button>

                {/* User Menu Icon */}
                <IconButton 
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    className="text-primary-dark"
                >
                    <PersonIcon className="w-6 h-6" />
                </IconButton>
                
                {/* User Menu */}
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                >
                    <MenuItem onClick={handleClose}>
                        <SettingsIcon fontSize="small" sx={{ mr: 1 }} /> Account Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                </Menu>
            </div>
        </header>
    );
};

export default Header;