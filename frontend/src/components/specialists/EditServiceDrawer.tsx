import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Drawer, Box, Typography, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Specialist as SpecialistType } from '@/store/specialistSlice';
import AdditionalOfferingsSection from './AdditionalOfferingsSection';
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
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Now sends simple JSON, no FormData needed
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

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: '40vw', maxWidth: '700px', minWidth: '500px' } }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="flex justify-between items-center mb-6">
                    <Typography variant="h5" className="font-bold">Edit Service</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {error && <Typography color="error" className="bg-red-50 p-3 rounded-md text-sm">{error}</Typography>}
                    
                    <TextField name="title" label="Title" value={formData.title} onChange={handleInputChange} fullWidth required />
                    <TextField name="description" label="Description" value={formData.description} onChange={handleInputChange} fullWidth multiline rows={5} required helperText="500 words"/>
                    <TextField name="duration_days" label="Estimated Completion Time (Days)" type="number" value={formData.duration_days} onChange={handleInputChange} fullWidth required />
                    <TextField name="base_price" label="Price" type="number" value={formData.base_price} onChange={handleInputChange} fullWidth required 
                        InputProps={{ startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>MYR</Typography> }} 
                    />
                    
                    <div>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>Additional Offerings</Typography>
                        <AdditionalOfferingsSection />
                    </div>
                </form>

                <div className="mt-auto flex justify-end space-x-3 border-t pt-4">
                    <Button onClick={onClose} variant="outlined">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Confirm'}</Button>
                </div>
            </Box>
        </Drawer>
    );
};

export default EditServiceDrawer;
