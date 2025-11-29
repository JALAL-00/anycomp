// src/app/admin/layout.tsx (FULL CORRECTED CODE - Applying AuthGuard)

import AdminLayout from '@/components/layout/AdminLayout';
import AuthGuard from '@/components/layout/AuthGuard'; 
import { UserRole } from '@/store/authSlice'; 

/**
 * Layout for all pages under the /admin route group.
 * This layout enforces that only 'admin' roles can access these pages.
 */
export default function AdminRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The AuthGuard will handle the role check and redirect away if non-admin/unauthenticated.
    // If it passes, it renders the AdminLayout and children.
    <AuthGuard allowedRoles={['admin']}>
        <AdminLayout>
            {children}
        </AdminLayout>
    </AuthGuard>
  );
}