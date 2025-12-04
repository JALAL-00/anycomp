'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Box, Drawer } from '@mui/material';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 270;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex h-screen bg-bg-light font-body">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 }, display: { xs: 'none', lg: 'block' } }}
      >
        <Sidebar />
      </Box>

      {/* Mobile Drawer Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile.
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Sidebar />
      </Drawer>
      
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        {/* Pass the toggle function to Header */}
        <Header onMobileMenuToggle={handleDrawerToggle} />
        <main className="flex-1 p-4 md:p-8 bg-white"> 
          <div className='max-w-7xl mx-auto'>
              {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;