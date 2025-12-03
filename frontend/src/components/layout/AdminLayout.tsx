// src/components/layout/AdminLayout.tsx 
'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-bg-light font-body">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
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