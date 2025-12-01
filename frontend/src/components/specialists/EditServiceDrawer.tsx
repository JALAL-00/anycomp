import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Drawer, Box, Typography, TextField, Button, IconButton, CircularProgress, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Specialist as SpecialistType, Media } from '@/store/specialistSlice';
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

interface ImagePreview {
    file: File;
    previewUrl: string;
}

const EditServiceDrawer: React.FC<EditServiceDrawerProps> = ({ open, onClose, service, onSaveSuccess }) => {
    const [formData, setFormData] = useState<FormState>({
        title: service.title,
        description: service.description,
        duration_days: service.duration_days || 1,
        base_price: parseFloat(String(service.base_price)) || 0,
    });
    const [existingMedia, setExistingMedia] = useState<Media[]>(service.media || []);
    const [newImages, setNewImages] = useState<ImagePreview[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['duration_days', 'base_price'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };

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
        submissionData.append('duration_days', formData.duration_days.toString());
        submissionData.append('base_price', formData.base_price.toString());
        
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
            duration_days: service.duration_days || 1,
            base_price: parseFloat(String(service.base_price)) || 0
        });
        setExistingMedia(service.media || []);
        setNewImages([]);
    }, [service]);

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
                    <TextField name="base_price" label="Price (MYR)" type="number" value={formData.base_price} onChange={handleInputChange} fullWidth required 
                        InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>MYR</Typography> }} 
                    />
                    
                    <div>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>Additional Offerings</Typography>
                        <AdditionalOfferingsSection />
                    </div>

                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography className="font-semibold mb-2">Manage Images</Typography>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {existingMedia.map(media => (
                                <div key={media.id} className="relative group aspect-square">
                                    <img src={media.file_name} className="w-full h-full object-cover rounded" />
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <IconButton size="small" className="bg-white/80 hover:bg-white" onClick={() => removeExistingImage(media.id)}><DeleteIcon fontSize="small" color="error"/></IconButton>
                                    </div>
                                </div>
                            ))}
                             {newImages.map(image => (
                                <div key={image.previewUrl} className="relative group aspect-square">
                                    <img src={image.previewUrl} className="w-full h-full object-cover rounded border" />
                                     <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <IconButton size="small" className="bg-white/80 hover:bg-white" onClick={() => removeNewImage(image.previewUrl)}><CloseIcon fontSize="small" /></IconButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outlined" component="label" fullWidth>Upload New Images <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} /></Button>
                    </Paper>
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
