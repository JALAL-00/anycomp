// frontend/src/app/admin/layout.tsx (FINAL CLEANED CODE - No Server Component Violations)

import AdminLayout from '@/components/layout/AdminLayout';
import AuthGuard from '@/components/layout/AuthGuard'; 
import { UserRole } from '@/store/authSlice'; 

// The unused/problematic imports are removed
// import { usePathname } from 'next/navigation'; 
// import { useEffect, useState } from 'react'; 


/**
 * Layout for all pages under the /admin route group.
 */
export default function AdminRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRoles={['admin']}>
        {/* We keep the clean AdminLayout structure */}
        <AdminLayout>
            {children}
        </AdminLayout>
    </AuthGuard>
  );
}