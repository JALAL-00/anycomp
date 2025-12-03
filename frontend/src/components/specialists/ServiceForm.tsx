'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Typography, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel, IconButton, Box, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Specialist as SpecialistType, Media } from '@/store/specialistSlice';
import ProfessionalFeeCard from './ProfessionalFeeCard';
import AdditionalOfferingsSection from './AdditionalOfferingsSection';
import api from '@/lib/api';

interface ServiceFormProps {
    mode: 'create' | 'edit';
    initialData?: SpecialistType;
    onSaveSuccess?: (updatedData: SpecialistType) => void;
    onCancel?: () => void;
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

const ServiceForm: React.FC<ServiceFormProps> = ({ mode, initialData, onSaveSuccess, onCancel }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormState>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        duration_days: initialData?.duration_days || 7,
        base_price: initialData ? parseFloat(String(initialData.base_price)) : 1800,
    });
    const [existingMedia, setExistingMedia] = useState<Media[]>(initialData?.media || []);
    const [newImages, setNewImages] = useState<ImagePreview[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const SERVICE_FEE_RATE = 0.20;
    const serviceFee = formData.base_price * SERVICE_FEE_RATE;
    const totalFee = formData.base_price + serviceFee;
    const yourReturns = formData.base_price;

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                duration_days: initialData.duration_days,
                base_price: parseFloat(String(initialData.base_price)),
            });
            setExistingMedia(initialData.media || []);
        }
    }, [initialData]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['duration_days', 'base_price'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
            setNewImages(prev => [...prev, ...filesArray]);
        }
    };

    const removeExistingImage = async (mediaId: string) => {
        try {
            await api.delete(`/specialists/media/${mediaId}`);
            setExistingMedia(prev => prev.filter(media => media.id !== mediaId));
        } catch (err) { setError('Failed to delete image.'); }
    };
    
    const removeNewImage = (previewUrl: string) => {
        setNewImages(prev => prev.filter(img => img.previewUrl !== previewUrl));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!formData.title || !formData.description || formData.base_price <= 0) {
            setError("Title, Description, and a valid Price are required.");
            return;
        }
        setLoading(true);

        const submissionData = new FormData();
        submissionData.append('title', formData.title);
        submissionData.append('description', formData.description);
        submissionData.append('duration_days', String(formData.duration_days));
        submissionData.append('base_price', String(formData.base_price));
        newImages.forEach(img => { submissionData.append('images', img.file); });

        try {
            if (mode === 'create') {
                await api.post('/specialists', submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
                router.push('/admin/specialists');
            } else if (initialData) {
                const response = await api.put(`/specialists/${initialData.id}`, submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
                if(onSaveSuccess) onSaveSuccess(response.data.data);
            }
        } catch (err: any) {
            setError(err.message || `Failed to ${mode} service.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-8">
            <div className="flex-1 space-y-8 max-w-4xl">
                {error && <Typography color="error" className="bg-red-50 p-3 rounded-md text-sm">{error}</Typography>}
                <div>
                    <Typography className='font-semibold mb-1'>SERVICE DETAILS</Typography>
                    <TextField name="title" label="Service Title *" value={formData.title} onChange={handleInputChange} fullWidth />
                </div>
                <TextField name="description" label="Description *" value={formData.description} onChange={handleInputChange} fullWidth multiline rows={4} helperText="(500 words)" />
                <div className="flex space-x-4">
                    <TextField name="duration_days" label="Estimated Completion Time" type="number" value={formData.duration_days} onChange={handleInputChange} fullWidth select>
                        <MenuItem value={7}>7 Days</MenuItem>
                        <MenuItem value={14}>14 Days</MenuItem>
                    </TextField>
                    <TextField label="Supported Company Types" value="Private Limited - Sdn. Bhd" fullWidth select>
                        <MenuItem value="Private Limited - Sdn. Bhd">Private Limited - Sdn. Bhd</MenuItem>
                    </TextField>
                </div>
                <div>
                    <Typography className='font-semibold mb-2'>Service Images</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {existingMedia.map(media => (
                                <div key={media.id} className="relative group aspect-square"><img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${media.file_name}`} className="w-full h-full object-cover rounded" /><div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"><IconButton size="small" className="bg-white/80 hover:bg-white" onClick={() => removeExistingImage(media.id)}><DeleteIcon fontSize="small" color="error"/></IconButton></div></div>
                            ))}
                            {newImages.map(image => (
                                <div key={image.previewUrl} className="relative group aspect-square"><img src={image.previewUrl} className="w-full h-full object-cover rounded border" /><div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"><IconButton size="small" className="bg-white/80 hover:bg-white" onClick={() => removeNewImage(image.previewUrl)}><CloseIcon fontSize="small" /></IconButton></div></div>
                            ))}
                        </div>
                        <Button variant="outlined" component="label" fullWidth>Upload New Images <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} /></Button>
                    </Paper>
                </div>
                <div>
                    <Typography className='font-semibold mb-2'>Additional Offerings</Typography>
                    <AdditionalOfferingsSection />
                </div>
            </div>
            <div className="w-[320px] flex-shrink-0">
                <ProfessionalFeeCard basePrice={formData.base_price} serviceFee={serviceFee} totalFee={totalFee} yourReturns={yourReturns} onBasePriceChange={(price) => setFormData(prev => ({ ...prev, base_price: price }))} />
                {mode === 'edit' && (<div className="mt-6 flex justify-end space-x-3"><Button onClick={onCancel} variant="outlined">Cancel</Button><Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Confirm'}</Button></div>)}
            </div>
        </form>
    );
};

export default ServiceForm;