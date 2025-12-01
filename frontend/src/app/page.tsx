// src/app/page.tsx (SIMPLIFIED REDIRECT)

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/admin/specialists');
}