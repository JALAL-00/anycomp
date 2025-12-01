'use client';

import React, { useEffect, useState } from 'react';
import { Specialist } from '@/store/specialistSlice';
import SpecialistCard from '@/components/public/SpecialistCard';
import { Typography, CircularProgress, Box, Breadcrumbs, Link, Select, MenuItem } from '@mui/material';
import api from '@/lib/api';

export default function PublicSpecialistsPage() {
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublished = async () => {
            try {
                const response = await api.get('/public/specialists');
                setSpecialists(response.data.data);
            } catch (error) {
                console.error("Failed to fetch published specialists", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPublished();
    }, []);

    return (
        <Box sx={{ maxWidth: '1400px', mx: 'auto', p: 4 }}>
            <header className="flex justify-between items-center py-4 mb-6 border-b">
                 <Typography variant="h4" sx={{ fontWeight: 'bold' }}>ANYCOMP</Typography>
            </header>

            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link underline="hover" color="inherit" href="#">Specialists</Link>
                <Typography color="text.primary">Register a New Company</Typography>
            </Breadcrumbs>
            
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Register a New Company</Typography>
            <Typography sx={{ color: 'text.secondary', mb: 4 }}>Get Your Company Registered with a Trusted Specialists</Typography>

            <div className="flex space-x-2 mb-4">
                 <Select defaultValue="price" size="small" sx={{ borderRadius: '8px' }}>
                     <MenuItem value="price">Price</MenuItem>
                </Select>
                 <Select defaultValue="sort" size="small" sx={{ borderRadius: '8px' }}>
                     <MenuItem value="sort">Sort by</MenuItem>
                </Select>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64"><CircularProgress /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {specialists.map(specialist => (
                        <SpecialistCard key={specialist.id} specialist={specialist} />
                    ))}
                </div>
            )}
        </Box>
    );
}