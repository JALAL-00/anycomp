// src/components/specialists/ProfessionalFeeCard.tsx (NEW FILE)
'use client';

import React from 'react';
import { Paper, Typography, TextField, InputAdornment, Divider } from '@mui/material';

interface ProfessionalFeeCardProps {
    basePrice: number;
    serviceFee: number;
    totalFee: number;
    yourReturns: number;
    onBasePriceChange: (price: number) => void;
}

/**
 * Fixed price panel on the right side of the Create/Edit form (Matching Figma).
 */
const ProfessionalFeeCard: React.FC<ProfessionalFeeCardProps> = ({ 
    basePrice, serviceFee, totalFee, yourReturns, onBasePriceChange 
}) => {
    return (
        <Paper className="p-6 sticky top-4 shadow-xl" sx={{ borderRadius: '8px', border: '1px solid #E0E0E0' }}>
            <Typography variant="h6" className="font-semibold text-text-primary mb-2">Professional Fee</Typography>
            <Typography variant="body2" className="text-zinc-500 mb-4">Set a rate for your service</Typography>

            {/* Main Price Display (Large RM) */}
            <Typography variant="h4" className="font-bold text-primary-dark mb-4 text-center">
                RM {basePrice.toLocaleString('en-MY')}
            </Typography>

            <TextField
                fullWidth
                label="Base Price"
                name="base_price"
                type="number"
                variant="outlined"
                value={basePrice}
                onChange={(e) => onBasePriceChange(parseFloat(e.target.value))}
                InputProps={{
                    startAdornment: <InputAdornment position="start">RM</InputAdornment>,
                }}
                sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
            />

            <Divider sx={{ mb: 2 }} />

            {/* Breakdown */}
            <div className='space-y-3'>
                <div className='flex justify-between text-sm text-zinc-700'>
                    <Typography component="span" className='font-medium'>Base price</Typography>
                    <Typography component="span">RM {basePrice.toFixed(2)}</Typography>
                </div>
                <div className='flex justify-between text-sm text-zinc-700'>
                    <Typography component="span" className='font-medium'>Service processing fee</Typography>
                    <Typography component="span">RM {serviceFee.toFixed(2)}</Typography>
                </div>
                <div className='flex justify-between text-sm font-semibold text-text-primary'>
                    <Typography component="span">Total</Typography>
                    <Typography component="span">RM {totalFee.toFixed(2)}</Typography>
                </div>
                <div className='flex justify-between text-sm font-semibold text-green-600'>
                    <Typography component="span">Your returns</Typography>
                    <Typography component="span">RM {yourReturns.toFixed(2)}</Typography>
                </div>
            </div>
        </Paper>
    );
};

export default ProfessionalFeeCard;