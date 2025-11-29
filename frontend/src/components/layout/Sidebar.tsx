// src/components/layout/Sidebar.tsx (FINAL PIXEL-PERFECT WHITE BACKGROUND UPDATE)
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
// Icons required by Figma/Assessment (using MUI Icons)
// Note: Using standard Line Icons for a cleaner look that matches the Figma wireframe
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import ReceiptIcon from '@mui/icons-material/ReceiptOutlined';
import MailIcon from '@mui/icons-material/MailOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HelpIcon from '@mui/icons-material/HelpOutlineOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined'; // Using tag icon for Specialists
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined'; // For Invoices
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'; // For eSignature

// Navigation Menu Items (Matching the Figma design's sidebar)
const navItems = [
  { name: 'Specialists', href: '/admin/specialists', icon: LocalOfferIcon }, // Using LocalOffer for better fit
  { name: 'Clients', href: '/admin/clients', icon: PeopleIcon },
  { name: 'Service Orders', href: '/admin/service-orders', icon: ReceiptIcon },
  { name: 'eSignature', href: '/admin/e-signature', icon: EditOutlinedIcon },
  { name: 'Messages', href: '/admin/messages', icon: MailIcon },
  { name: 'Invoices & Receipts', href: '/admin/invoices', icon: DescriptionIcon },
];

// Utility Menu Items (Help/Settings)
const utilityItems = [
  { name: 'Help', href: '/admin/help', icon: HelpIcon },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
];


/**
 * Renders the fixed, white-background sidebar navigation.
 */
const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const renderLink = (item: typeof navItems[0]) => {
    const isActive = pathname === item.href;
    
    // Figma Active: Dark Navy BG, White Text/Icon
    // Figma Inactive: Dark Text, Hover is slight background shift
    const activeClass = isActive 
        ? 'bg-[#00244F] text-white' 
        : 'text-text-primary hover:bg-zinc-100'; 
        
    const iconClass = isActive ? 'text-white' : 'text-zinc-700';

    return (
      <Link 
        key={item.name}
        href={item.href}
        // Tighter spacing p-2.5, space-x-2 and slight roundness
        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${activeClass}`}
      >
        {/* Render Icon with class controlled by active state */}
        <item.icon className={`w-5 h-5 ${iconClass}`} sx={{ fontSize: 20 }} />
        <span className="text-sm font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    // Sidebar: White BG, Shadow (optional: slight right border/shadow for depth)
    <div className="w-[270px] flex-shrink-0 bg-white h-full flex flex-col justify-between p-4 shadow-xl border-r border-zinc-100">
      
      {/* Top Section */}
      <div>
        {/* Profile Section (Figma's look) */}
        <div className="p-2.5 mb-8"> {/* Adjusted padding/margin */}
          <p className="text-xl font-bold mb-6 text-text-primary">Profile</p> 
          <div className="flex items-center space-x-3">
            {/* Mock Image - For now, use an empty div or a placeholder to mimic the look */}
            {/* NOTE: You should eventually add a placeholder image in public/ */}
            <div className='w-10 h-10 rounded-full overflow-hidden bg-zinc-200'>
                {/* For production, use <Image src="/path/to/avatar.jpg" ... */}
            </div>
            <div>
              <p className="text-base leading-tight font-semibold text-text-primary">Gwen Lam</p>
              <p className="text-sm text-primary-blue leading-tight mt-0.5">ST Comp Holdings Sdn Bhd</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="text-sm text-zinc-500 font-medium px-3 mb-2">Dashboard</p>
          {navItems.map(renderLink)}
        </div>
      </div>

      {/* Bottom Section (Help & Settings) */}
      <div className="space-y-1 border-t border-zinc-200 pt-4">
        {utilityItems.map(renderLink)}
      </div>
    </div>
  );
};

export default Sidebar;