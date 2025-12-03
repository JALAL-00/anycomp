'use client';

import React, { useState } from 'react'; // This line is now fixed
import { Chip, TextField, IconButton, InputAdornment, Box, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

const AdditionalOfferingsSection: React.FC = () => {
    const [offerings, setOfferings] = useState<string[]>([
        "Company Secretary Subscription",
        "CTC Copies",
        "eSignature"
    ]);
    const [newValue, setNewValue] = useState("");

    const handleAdd = () => {
        if (newValue.trim() && !offerings.includes(newValue.trim())) {
            setOfferings([...offerings, newValue.trim()]);
            setNewValue("");
        }
    };

    const handleDelete = (itemToDelete: string) => {
        setOfferings(offerings.filter((item) => item !== itemToDelete));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <Box>
            <TextField 
                fullWidth 
                placeholder="Add offering (e.g., Priority Filing)" 
                variant="outlined"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={handleKeyPress}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleAdd} edge="end">
                                <AddCircleOutlineIcon color="primary"/>
                            </IconButton>
                        </InputAdornment>
                    ),
                    sx: {
                        borderRadius: '12px',
                        bgcolor: '#FFF',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E2E8F0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#CBD5E1',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3B82F6',
                        },
                    }
                }}
            />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {offerings.map((offering, index) => (
                    <Chip 
                        key={index}
                        label={offering}
                        onDelete={() => handleDelete(offering)}
                        deleteIcon={<CloseIcon style={{ color: '#94A3B8' }} />}
                        sx={{ 
                            bgcolor: '#F8FAFC',
                            color: '#475569',
                            fontWeight: 500,
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            '& .MuiChip-deleteIcon': {
                                fontSize: '16px',
                                '&:hover': {
                                    color: '#64748B',
                                }
                            }
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}; 

export default AdditionalOfferingsSection;