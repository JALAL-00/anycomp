// src/app/admin/specialists/page.tsx (UPDATED to match Figma/Requirements)
'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchSpecialists } from '@/lib/dataFetcher';
import SpecialistFilter from '@/components/specialists/SpecialistFilter';
import SpecialistTable from '@/components/specialists/SpecialistTable';
import { Typography } from '@mui/material';

export default function SpecialistsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { filter, search, page, limit, error } = useSelector((state: RootState) => state.specialists);

  // Side Effect: Fetch data whenever filter, search, or page changes
  useEffect(() => {
    // Ensure the Admin Token is present for the API interceptor
    // This is a mock setup to prevent 401 on initial load
    if (!localStorage.getItem('admin_token')) {
        // NOTE: Replace this with the Admin Token you acquired in Postman Test 1.1
        localStorage.setItem('admin_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk0MzM5NmMyLTM1OTgtNDg0Yy04MjVmLTcwZmRjNzMyM2E2OSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NDQzODgwNSwiZXhwIjoxNzY1MDQzNjA1fQ.OnMRJiChNPzAQc0DNLgsUnxYYeaNPEX_ME_0AZRe6es');
    }
    
    // Fetch data using current state parameters
    dispatch(fetchSpecialists({ filter, search, page, limit }));
  }, [filter, search, page, limit, dispatch]);

  return (
    <div className="space-y-6">
      
      {/* Page Title and Subtext (Figma Top Section) */}
      <div className='mb-8'>
        <Typography 
          variant="h4" 
          className="font-sans font-semibold text-2xl text-text-primary"
          sx={{ mb: 0.5 }}
        >
          Specialists
        </Typography>
        <Typography variant="body2" className='text-zinc-500'>
          Create and publish your services for Client's & Companies
        </Typography>
      </div>
      
      {/* Filter, Search, and Buttons */}
      <SpecialistFilter />
      
      {/* Error Message */}
      {error && (
        <Typography color="error" className='py-4 border border-accent-red bg-accent-red/10 p-4 rounded-lg'>
          Error: {error}
        </Typography>
      )}

      {/* Specialist Table (Page 1: Table & Pagination) */}
      <SpecialistTable />

    </div>
  );
}