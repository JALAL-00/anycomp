'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import ReceiptIcon from '@mui/icons-material/ReceiptOutlined';
import MailIcon from '@mui/icons-material/MailOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HelpIcon from '@mui/icons-material/HelpOutlineOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // For "Services"
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined'; // For "Specialists"

// Define the two distinct navigation items
const navItems = [
  { name: 'Specialists', href: '/admin/specialists', icon: LocalOfferIcon },
  { name: 'Services', href: '/admin/services', icon: BusinessCenterIcon },
  { name: 'Clients', href: '/admin/clients', icon: PeopleIcon },
  { name: 'Service Orders', href: '/admin/service-orders', icon: ReceiptIcon },
  { name: 'eSignature', href: '/admin/e-signature', icon: EditOutlinedIcon },
  { name: 'Messages', href: '/admin/messages', icon: MailIcon },
  { name: 'Invoices & Receipts', href: '/admin/invoices', icon: DescriptionIcon },
];

const utilityItems = [
  { name: 'Help', href: '/admin/help', icon: HelpIcon },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  // Determine which link should be shown and active
  const isServiceDetailPage = pathname.startsWith('/admin/services');

  return (
    <div className="w-[270px] flex-shrink-0 bg-white h-full flex flex-col justify-between p-4 shadow-xl border-r border-zinc-100">
      <div>
        <div className="p-2.5 mb-8">
          <p className="text-xl font-bold mb-6 text-text-primary">Profile</p> 
          <div className="flex items-center space-x-3">
            <div className='w-10 h-10 rounded-full overflow-hidden bg-zinc-100'></div>
            <div>
              <p className="text-base leading-tight font-semibold text-text-primary">Gwen Lam</p>
              <p className="text-sm text-primary-blue leading-tight mt-0.5">ST Comp Holdings Sdn Bhd</p>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-zinc-500 font-medium px-3 mb-2">Dashboard</p>
          {navItems.map(item => {
            // Logic to conditionally render and highlight the correct link
            if (item.name === 'Services' && !isServiceDetailPage) return null;
            if (item.name === 'Specialists' && isServiceDetailPage) return null;

            const isActive = pathname.startsWith(item.href);
            const activeClass = isActive ? 'bg-[#00244F] text-white' : 'text-text-primary hover:bg-zinc-100'; 
            const iconClass = isActive ? 'text-white' : 'text-zinc-700';

            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${activeClass}`}
              >
                <item.icon className={`w-5 h-5 ${iconClass}`} sx={{ fontSize: 20 }} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="space-y-1 border-t border-zinc-200 pt-4">
        {utilityItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            const activeClass = isActive ? 'bg-[#00244F] text-white' : 'text-text-primary hover:bg-zinc-100'; 
            const iconClass = isActive ? 'text-white' : 'text-zinc-700';
             return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${activeClass}`}
              >
                <item.icon className={`w-5 h-5 ${iconClass}`} sx={{ fontSize: 20 }} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
