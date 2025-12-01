// frontend/src/app/admin/specialists/create/page.tsx (FINAL CLEANED CODE)
'use client';

import React from 'react';
import EditPageWrapper from '@/components/specialists/EditPageWrapper';

export default function CreateSpecialistPage() {
  return <EditPageWrapper specialistId={'new-item-id'} mode={'create'} />;
}