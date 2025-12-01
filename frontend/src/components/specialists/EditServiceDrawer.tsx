import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Drawer, Box, Typography, TextField, Button, IconButton, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Specialist as SpecialistType, Media } from '@/store/specialistSlice';
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
    base_price: number;
    duration_days: number;
}

interface ImagePreview {
    file: File;
    previewUrl: string;
}

const EditServiceDrawer: React.FC<EditServiceDrawerProps> = ({ open, onClose, service, onSaveSuccess }) => {
    const [formData, setFormData] = useState<FormState>({
        title: service.title,
        description: service.description,
        base_price: parseFloat(String(service.base_price)) || 0,
        duration_days: service.duration_days || 1,
    });
    const [existingMedia, setExistingMedia] = useState<Media[]>(service.media || []);
    const [newImages, setNewImages] = useState<ImagePreview[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'base_price' ? parseFloat(value) || 0 : value }));
    };

    const handleSelectChange = (e: any) => {
        setFormData(prev => ({ ...prev, duration_days: e.target.value }));
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map(file => ({
                file,
                previewUrl: URL.createObjectURL(file)
            }));
            setNewImages(prev => [...prev, ...filesArray]);
        }
    };

    const removeExistingImage = async (mediaId: string) => {
        try {
            await api.delete(`/specialists/media/${mediaId}`);
            setExistingMedia(prev => prev.filter(media => media.id !== mediaId));
        } catch (err) {
            setError('Failed to delete image.');
        }
    };
    
    const removeNewImage = (previewUrl: string) => {
        setNewImages(prev => prev.filter(img => img.previewUrl !== previewUrl));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const submissionData = new FormData();
        submissionData.append('title', formData.title);
        submissionData.append('description', formData.description);
        submissionData.append('base_price', formData.base_price.toString());
        submissionData.append('duration_days', formData.duration_days.toString());
        
        newImages.forEach(img => {
            submissionData.append('images', img.file);
        });

        try {
            const response = await api.put(`/specialists/${service.id}`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onSaveSuccess(response.data.data);
        } catch (err: any) {
            setError(err.message || 'Failed to update service.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        setFormData({ 
            title: service.title, 
            description: service.description, 
            base_price: parseFloat(String(service.base_price)) || 0,
            duration_days: service.duration_days || 1
        });
        setExistingMedia(service.media || []);
        setNewImages([]);
    }, [service]);

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: '50vw', maxWidth: '700px' } }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="flex justify-between items-center mb-6">
                    <Typography variant="h5" className="font-bold">Edit Service</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2">
                    {error && <Typography color="error" className="bg-red-50 p-3 rounded-md">{error}</Typography>}
                    
                    <TextField name="title" label="Title" value={formData.title} onChange={handleInputChange} fullWidth required />
                    <TextField name="description" label="Description" value={formData.description} onChange={handleInputChange} fullWidth multiline rows={5} required helperText="500 words"/>
                    
                    <FormControl fullWidth>
                        <InputLabel>Estimated Completion Time (Days)</InputLabel>
                        <Select value={formData.duration_days} label="Estimated Completion Time (Days)" onChange={handleSelectChange}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={14}>14</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <TextField name="base_price" label="Price (MYR)" type="number" value={formData.base_price} onChange={handleInputChange} fullWidth required />
                    
                    <div>
                        <Typography className="font-semibold mb-2">Additional Offerings</Typography>
                        <div className="flex flex-wrap gap-2">
                             <div className="p-2 border rounded-md text-sm bg-gray-100">Company Secretary Subscription <IconButton size="small"><CloseIcon fontSize="inherit"/></IconButton></div>
                             <div className="p-2 border rounded-md text-sm bg-gray-100">CTC Copies <IconButton size="small"><CloseIcon fontSize="inherit"/></IconButton></div>
                             <div className="p-2 border rounded-md text-sm bg-gray-100">eSignature <IconButton size="small"><CloseIcon fontSize="inherit"/></IconButton></div>
                        </div>
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
