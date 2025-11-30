'use client';

import React, { useState } from "react"; 
import { Chip, TextField, IconButton, InputAdornment } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AdditionalOfferingsSection: React.FC = () => {
    // Note: In a real implementation, this state would be lifted to the parent Form
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
        <div className="space-y-3">
             <TextField 
                fullWidth 
                placeholder="Add offering (e.g., Priority Filing)" 
                variant="outlined"
                size="small"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={handleKeyPress}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#F9FAFB' } }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleAdd} edge="end" color="primary">
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            
            <div className="flex flex-wrap gap-2 min-h-[40px]">
                {offerings.map((offering, index) => (
                    <Chip 
                        key={index}
                        label={offering}
                        onDelete={() => handleDelete(offering)}
                        sx={{ 
                            borderRadius: '6px', 
                            bgcolor: '#F3F4F6',
                            color: '#374151',
                            fontWeight: 500
                        }}
                    />
                ))}
            </div>
        </div>
    );
}; 

export default AdditionalOfferingsSection;