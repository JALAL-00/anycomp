'use client';

import React, { useState } from 'react';
import { 
    TextField, Typography, Button, CircularProgress, Select, 
    MenuItem, FormControl, InputLabel, IconButton
} from '@mui/material';
import { useRouter } from 'next/navigation';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import ProfessionalFeeCard from './ProfessionalFeeCard';
import AdditionalOfferingsSection from './AdditionalOfferingsSection';
import ProfileCardSection from './ProfileCardSection';
import api from '@/lib/api';

interface FormState {
    title: string;
    description: string;
    base_price: number;
    duration_days: number;
    category: string;
    completion_time_label: string;
}

const initialFormState: FormState = { 
    title: '',
    description: '',
    base_price: 1800,
    duration_days: 7,
    category: 'Incorporation',
    completion_time_label: '7 Days'
};

interface MediaSlot {
    file: File | null;
    preview: string | null;
    id: number;
}

const SpecialistForm: React.FC = () => {
    const router = useRouter(); 
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [mediaSlots, setMediaSlots] = useState<MediaSlot[]>([
        { id: 1, file: null, preview: null },
        { id: 2, file: null, preview: null },
        { id: 3, file: null, preview: null },
    ]);

    const SERVICE_FEE_RATE = 0.20; 
    const serviceFee = formData.base_price * SERVICE_FEE_RATE;
    const totalFee = formData.base_price + serviceFee;
    const yourReturns = formData.base_price;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const numericValue = (name === 'base_price' || name === 'duration_days') ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: numericValue }));
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleFileChange = (slotId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { alert('File max 4MB'); return; }
            const preview = URL.createObjectURL(file);
            setMediaSlots(prev => prev.map(slot => slot.id === slotId ? { ...slot, file, preview } : slot));
        }
    };

    const removeFile = (slotId: number) => {
        setMediaSlots(prev => prev.map(slot => slot.id === slotId ? { ...slot, file: null, preview: null } : slot));
    };

    const handleFormSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSubmissionError(null);

        if (!formData.title.trim() || !formData.description.trim() || formData.base_price <= 0 || formData.duration_days <= 0) {
            setSubmissionError("Title, Description, and a valid Price/Duration are required.");
            return;
        }

        setLoading(true);

        const submissionPayload = new FormData();
        submissionPayload.append('title', formData.title);
        submissionPayload.append('description', formData.description);
        submissionPayload.append('base_price', String(formData.base_price));
        submissionPayload.append('duration_days', String(formData.duration_days));

        mediaSlots.forEach(slot => {
            if (slot.file) {
                submissionPayload.append('images', slot.file);
            }
        });
        
        try {
            await api.post('/specialists', submissionPayload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.push('/admin/specialists');
        } catch (error: any) {
            setSubmissionError(error || 'An error occurred during creation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full pb-20">
            <div className="flex items-center justify-between sticky top-0 bg-white pt-2 pb-6 z-10 border-b border-dashed border-zinc-200 mb-6">
                <Typography variant="h5" className="text-3xl font-semibold text-text-primary font-sans">
                   {formData.title || 'Create New Service'}
                </Typography>
                <div className="flex space-x-2">
                    <Button 
                        variant="contained" 
                        onClick={handleFormSubmit}
                        disabled={loading}
                        sx={{ borderRadius: '6px', bgcolor: '#00244F' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save & Create'}
                    </Button>
                </div>
            </div>
            
            <form className="flex space-x-8" onSubmit={handleFormSubmit}>
                <div className="flex-1 space-y-10 max-w-4xl">
                    {submissionError && <Typography color="error" className='p-3 border border-red-200 bg-red-50 rounded-md text-sm'>{submissionError}</Typography>}

                    <div className='space-y-4'>
                        <Typography className='uppercase text-xs font-bold text-zinc-400 tracking-wide'>Service Details</Typography>
                        <TextField fullWidth required label="Service Title" name="title" value={formData.title} onChange={handleInputChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                        <TextField fullWidth required multiline rows={4} label="Description" name="description" value={formData.description} onChange={handleInputChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}/>
                        <div className="text-right text-xs text-zinc-400">(500 words)</div>
                    </div>
                    
                    <div className='flex space-x-4'>
                         <FormControl fullWidth>
                            <InputLabel>Estimated Completion Time</InputLabel>
                            <Select 
                                value={formData.completion_time_label} 
                                label="Estimated Completion Time"
                                name="completion_time_label"
                                onChange={handleSelectChange}
                                sx={{ borderRadius: '8px' }}
                            >
                                <MenuItem value="1 Day">1 Day</MenuItem>
                                <MenuItem value="3 Days">3 Days</MenuItem>
                                <MenuItem value="7 Days">7 Days</MenuItem>
                                <MenuItem value="14 Days">14 Days</MenuItem>
                            </Select>
                         </FormControl>
                         <FormControl fullWidth>
                            <InputLabel>Supported Company Types</InputLabel>
                             <Select 
                                value={formData.category} 
                                label="Supported Company Types"
                                name="category"
                                onChange={handleSelectChange}
                                sx={{ borderRadius: '8px' }}
                            >
                                <MenuItem value="Incorporation">Private Limited - Sdn. Bhd</MenuItem>
                                <MenuItem value="LLP">Limited Liability Partnership</MenuItem>
                                <MenuItem value="Enterprise">Sole Proprietor</MenuItem>
                            </Select>
                         </FormControl>
                    </div>

                    <div className="space-y-2">
                         <Typography className='font-semibold'>Service Images</Typography>
                         <div className="flex space-x-4">
                            {mediaSlots.map((slot, index) => (
                                <div key={slot.id} className="flex-1">
                                    <div className="border border-dashed border-zinc-300 rounded-lg h-40 bg-zinc-50 relative flex flex-col items-center justify-center hover:bg-zinc-100 transition-colors overflow-hidden group">
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(slot.id, e)} className="absolute w-full h-full opacity-0 cursor-pointer z-10" />
                                        {slot.preview ? (
                                            <>
                                                <img src={slot.preview} alt={`Slot ${slot.id}`} className="w-full h-full object-cover" />
                                                <IconButton 
                                                    size="small"
                                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); removeFile(slot.id); }}
                                                    className="absolute top-1 right-1 bg-white shadow-sm z-20 opacity-0 group-hover:opacity-100"
                                                >
                                                    <DeleteOutlineIcon fontSize='small' color="error" />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <>
                                                <CloudUploadOutlinedIcon className="text-primary-blue mb-2" fontSize='medium' />
                                                <Typography className="text-xs text-zinc-500 text-center font-medium">Service Image ({index + 1})</Typography>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>

                    <div className='pt-4'>
                        <Typography className='font-semibold mb-4'>Additional Offerings</Typography>
                        <AdditionalOfferingsSection />
                    </div>

                    <ProfileCardSection />
                </div>

                <div className="w-[320px] flex-shrink-0">
                    <ProfessionalFeeCard 
                        basePrice={formData.base_price}
                        serviceFee={serviceFee}
                        totalFee={totalFee}
                        yourReturns={yourReturns}
                        onBasePriceChange={(price) => setFormData(prev => ({ ...prev, base_price: price }))}
                    />
                </div>
            </form>
        </div>
    );
};

export default SpecialistForm;
