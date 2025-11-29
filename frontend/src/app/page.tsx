// src/app/page.tsx (SIMPLIFIED REDIRECT)

import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect the root path to the Admin Specialists Page
  redirect('/admin/specialists');
}