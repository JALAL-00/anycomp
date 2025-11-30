// frontend/src/app/admin/specialists/edit/[id]/page.tsx (FINAL CLEANED CODE)

import React from 'react';
import EditPageWrapper from '@/components/specialists/EditPageWrapper';

interface EditPageProps {
    params: {
        id: string;
    };
}

export default function EditSpecialistPage({ params }: EditPageProps) {
  
  return <EditPageWrapper specialistId={params.id} mode={'edit'} />;
}