// frontend/src/app/admin/specialists/create/page.tsx (FINAL CLEANED CODE)
'use client';

import React from 'react';
import EditPageWrapper from '@/components/specialists/EditPageWrapper';

export default function CreateSpecialistPage() {
  // Pass a dummy ID and set mode to 'create'. The wrapper handles the structure.
  return <EditPageWrapper specialistId={'new-item-id'} mode={'create'} />;
}