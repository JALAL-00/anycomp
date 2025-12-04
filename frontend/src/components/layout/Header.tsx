'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux'; 
import { RootState } from '@/store/store'; 
import { IconButton, Menu, MenuItem, Typography, Box, Badge, Divider } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu'; // Added Icon
import { useAuth } from '@/context/AuthContext';

// Added Props Interface to accept toggle handler
interface HeaderProps {
    onMobileMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
    const { logout } = useAuth();
    const pathname = usePathname();
    const { user } = useSelector((state: RootState) => state.auth); 
    const [breadcrumb, setBreadcrumb] = useState('Dashboard');

    useEffect(() => {
        if (pathname.startsWith('/admin/specialists/create')) { setBreadcrumb('Dashboard / Create'); } 
        else if (pathname.startsWith('/admin/services')) { setBreadcrumb('Dashboard / Edit Services'); } 
        else if (pathname.startsWith('/admin/specialists')) { setBreadcrumb('Dashboard / Services'); } 
        else { setBreadcrumb('Dashboard'); }
    }, [pathname]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
    const handleClose = () => { setAnchorEl(null); };
    const handleLogout = () => { logout(); handleClose(); };

    return (
        <header className="flex-shrink-0 flex items-center justify-between h-20 px-4 md:px-8 border-b border-zinc-200 bg-white sticky top-0 z-20">
            <div className="flex items-center">
                {/* Mobile Hamburger Button (Hidden on Desktop) */}
                <IconButton 
                    edge="start" 
                    color="inherit" 
                    aria-label="menu" 
                    onClick={onMobileMenuToggle}
                    sx={{ mr: 2, display: { lg: 'none' }, color: 'text.secondary' }}
                >
                    <MenuIcon />
                </IconButton>
                
                <Box><Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{breadcrumb}</Typography></Box>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
                <IconButton sx={{ color: 'text.secondary' }}><MailOutlineIcon /></IconButton>
                <IconButton sx={{ color: 'text.secondary' }}><Badge color="error" variant="dot"><NotificationsNoneIcon /></Badge></IconButton>
                <IconButton onClick={handleClick} size="small"><PersonOutlineIcon /></IconButton>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            overflow: 'visible',
                            borderRadius: '12px',
                            mt: 1.5,
                            minWidth: 220, 
                            '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, },
                            '&::before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, },
                        },
                    }}
                >
                    <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Signed in as</Typography>
                        <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleClose}>
                        <SettingsIcon fontSize="small" sx={{ mr: 1.5 }} /> Account Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Logout
                    </MenuItem>
                </Menu>
            </div>
        </header>
    );
};

export default Header;
