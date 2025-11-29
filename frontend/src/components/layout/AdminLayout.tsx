// src/components/layout/AdminLayout.tsx (FINAL PIXEL-PERFECT UPDATE)
'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Defines the main dashboard layout with a fixed white sidebar and a content area.
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-bg-light font-body">
      {/* 1. Sidebar (Fixed) */}
      <Sidebar />
      
      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header sits above the main content window */}
        <Header />
        
        {/* Main scrollable content area: White background to match Figma content area */}
        <main className="flex-1 p-8 bg-white"> 
          <div className='max-w-7xl mx-auto'>
              {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;