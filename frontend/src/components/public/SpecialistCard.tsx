'use client';

import React from 'react';
import { Specialist } from '@/store/specialistSlice';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

interface SpecialistCardProps {
    specialist: Specialist;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ specialist }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
    const relativeImagePath = specialist.media?.find(m => m.display_order === 1)?.file_name;
    const coverImage = relativeImagePath ? `${API_BASE_URL}${relativeImagePath}` : undefined;
    
    return (
        <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            {coverImage ? (
                <CardMedia
                    component="img"
                    height="180"
                    image={coverImage}
                    alt={specialist.title}
                />
            ) : (
                <Box
                    sx={{
                        height: 180,
                        bgcolor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary',
                        fontSize: '0.8rem'
                    }}
                >
                    No Image Available
                </Box>
            )}

            <CardContent>
                <Typography gutterBottom variant="body2" component="div" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                    Adam Low - Company Secretary
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', minHeight: '48px' }}>
                    {specialist.title}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                    RM {parseFloat(String(specialist.final_price || '0')).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SpecialistCard;