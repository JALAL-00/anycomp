'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { usePathname } from 'next/navigation'; // Import usePathname
import { fetchSpecialists } from '@/lib/dataFetcher';
import SpecialistFilter from '@/components/specialists/SpecialistFilter';
import SpecialistTable from '@/components/specialists/SpecialistTable';
import { Typography } from '@mui/material';

export default function SpecialistsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname(); // Get the current URL path
  const { filter, search, page, limit, error } = useSelector((state: RootState) => state.specialists);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSpecialists({ filter, search, page, limit }));
    }
  }, [filter, search, page, limit, dispatch, isAuthenticated, pathname]); // Add pathname here

  return (
    <div className="space-y-6">
      
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
      
      <SpecialistFilter />
      
      {error && (
        <Typography color="error" className='py-4 border border-accent-red bg-accent-red/10 p-4 rounded-lg'>
          API Error: {error}. Please try logging out and logging back in.
        </Typography>
      )}

      <SpecialistTable />

    </div>
  );
}