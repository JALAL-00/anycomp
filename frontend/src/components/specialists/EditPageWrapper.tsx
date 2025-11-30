// frontend/src/components/specialists/EditPageWrapper.tsx (FULL CORRECTED CODE - Final Fix for Double Render)
'use client';

import React from 'react';
import SpecialistForm from './SpecialistForm';
import { Typography } from '@mui/material';

interface EditPageWrapperProps {
    specialistId: string;
    mode: 'create' | 'edit'; // Added mode prop for reusability
}

/**
 * Client-Side wrapper to securely read dynamic route parameters and render the Edit/Create Form.
 */
const EditPageWrapper: React.FC<EditPageWrapperProps> = ({ specialistId, mode }) => {

    return (
        <div className="min-h-full">
            {/* Store Context Mock (Constiant CoSec Services) - RENDERED ONLY ONCE HERE */}
            <div className="flex items-center space-x-3 mb-8">
                <div className='w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-[#0A66C2]'>
                    <span className='text-white text-xl font-bold'>SC</span>
                </div>
                <div>
                    <Typography className="text-xl font-semibold text-text-primary">Constiant CoSec Services</Typography>
                    <Typography className="text-sm text-zinc-500">Company Secretary | Store</Typography>
                </div>
            </div>
            
            {/* Pass ID to SpecialistForm and set mode */}
            <SpecialistForm mode={mode} specialistId={specialistId} />
        </div>
    );
}

export default EditPageWrapper;