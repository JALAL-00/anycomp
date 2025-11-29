// src/app/(admin)/layout.tsx
import AdminLayout from '@/components/layout/AdminLayout';

/**
 * Layout for all pages under the (admin) route group (e.g., /admin/specialists)
 */
export default function AdminRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}