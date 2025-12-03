'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Drawer, Box, Typography, TextField, Button, IconButton, CircularProgress, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Specialist as SpecialistType } from '@/store/specialistSlice';
import api from '@/lib/api';

interface EditServiceDrawerProps {
    open: boolean;
    onClose: () => void;
    service: SpecialistType;
    onSaveSuccess: (updatedService: SpecialistType) => void;
}

interface FormState {
    title: string;
    description: string;
    duration_days: number;
    base_price: number;
}

const EditServiceDrawer: React.FC<EditServiceDrawerProps> = ({ open, onClose, service, onSaveSuccess }) => {
    const [formData, setFormData] = useState<FormState>({
        title: service.title,
        description: service.description,
        duration_days: service.duration_days || 1,
        base_price: parseFloat(String(service.base_price)) || 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['duration_days', 'base_price'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); setLoading(true); setError(null);
        try {
            const response = await api.put(`/specialists/${service.id}`, formData);
            onSaveSuccess(response.data.data);
        } catch (err: any) {
            setError(err.message || 'Failed to update service.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (open) {
            setFormData({ 
                title: service.title, 
                description: service.description, 
                duration_days: service.duration_days || 1,
                base_price: parseFloat(String(service.base_price)) || 0
            });
            setError(null);
        }
    }, [open, service]);

    // Reusable Label component to match Figma's style
    const FormLabel = ({ children }: { children: React.ReactNode }) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>{children}</Typography>
    );

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: '40vw', maxWidth: '600px', minWidth: '500px' } }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="flex justify-between items-center mb-8">
                    <Typography variant="h5" className="font-bold">Edit Service</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2">
                    {error && <Typography color="error" className="bg-red-50 p-3 rounded-md text-sm">{error}</Typography>}
                    
                    <div>
                        <FormLabel>Title</FormLabel>
                        <TextField name="title" value={formData.title} onChange={handleInputChange} fullWidth required variant="outlined" size="small"/>
                    </div>
                    
                    <div>
                        <FormLabel>Description</FormLabel>
                        <TextField name="description" value={formData.description} onChange={handleInputChange} fullWidth multiline rows={5} required variant="outlined"/>
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: 'text.secondary' }}>(500 words)</Typography>
                    </div>

                    <div>
                        <FormLabel>Estimated Completion Time (Days)</FormLabel>
                        <TextField name="duration_days" type="number" value={formData.duration_days} onChange={handleInputChange} fullWidth required variant="outlined" size="small"/>
                    </div>
                    
                    <div>
                        <FormLabel>Price</FormLabel>
                        <TextField name="base_price" type="number" value={formData.base_price} onChange={handleInputChange} fullWidth required variant="outlined" size="small"
                            InputProps={{ 
                                startAdornment: (
                                    <Box component="span" sx={{ p: '8px 12px', borderRight: '1px solid #ccc', mr: 1, display: 'flex', alignItems: 'center' }}>
                                        <img src="https://flagcdn.com/w20/my.png" alt="MYR" style={{ marginRight: '8px' }}/> 
                                        <span>MYR</span>
                                    </Box>
                                ) 
                            }}
                            sx={{ '& .MuiInputBase-input': { textAlign: 'right' } }} 
                        />
                    </div>
                    
                    <div>
                        <FormLabel>Additional Offerings</FormLabel>
                        <TextField fullWidth placeholder="" variant="outlined" size="small"/>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Chip label="Company Secretary Subscription" onDelete={() => {}} size="small"/>
                            <Chip label="CTC Copies" onDelete={() => {}} size="small"/>
                            <Chip label="eSignature" onDelete={() => {}} size="small"/>
                            <Chip label="Company Secretary Subscription" onDelete={() => {}} size="small"/>
                        </div>
                    </div>
                </form>

                <div className="mt-auto flex justify-left space-x-3 border-t pt-6">
                    <Button onClick={onClose} variant="outlined" sx={{ width: '120px', borderRadius: '6px' }}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ width: '120px', borderRadius: '6px', bgcolor: '#00244F' }}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
                    </Button>
                </div>
            </Box>
        </Drawer>
    );
};

export default EditServiceDrawer;
