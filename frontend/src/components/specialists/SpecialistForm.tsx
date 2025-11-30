// frontend/src/components/specialists/SpecialistForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
    TextField, Typography, Button, CircularProgress, Select, 
    MenuItem, FormControl, InputLabel, IconButton // Added missing import
} from '@mui/material';
import { useRouter } from 'next/navigation';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import ProfessionalFeeCard from './ProfessionalFeeCard';
import AdditionalOfferingsSection from './AdditionalOfferingsSection';
import ProfileCardSection from './ProfileCardSection';
import ConfirmationModal from '../ui/ConfirmationModal'; 
import api from '@/lib/api';

interface MediaPayload { file_name: string; mime_type: string; file_size: number; display_order: number; }
interface FormState {
    title: string; description: string; base_price: number; duration_days: number;
    is_draft?: boolean;
    category: string; 
    completion_time_label: string;
}

const initialFormState: FormState = { 
    title: '', description: '', base_price: 1800, duration_days: 7, is_draft: true,
    category: 'Incorporation', completion_time_label: '7 Days'
};

interface SpecialistFormProps {
    mode: 'create' | 'edit';
    specialistId?: string; 
}

// Media Slot Interface
interface MediaSlot {
    file: File | null;
    preview: string | null;
    id: number; // 1, 2, 3
}

const SpecialistForm: React.FC<SpecialistFormProps> = ({ mode, specialistId }) => {
    const router = useRouter(); 
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [showPublishModal, setShowPublishModal] = useState(false);

    // Three Media Slots Logic
    const [mediaSlots, setMediaSlots] = useState<MediaSlot[]>([
        { id: 1, file: null, preview: null },
        { id: 2, file: null, preview: null },
        { id: 3, file: null, preview: null },
    ]);

    const SERVICE_FEE_RATE = 0.3; 
    const serviceFee = formData.base_price * SERVICE_FEE_RATE;
    const totalFee = formData.base_price + serviceFee;
    const yourReturns = totalFee * (1 - SERVICE_FEE_RATE);

    // --- FETCH DATA FOR EDIT MODE ---
    useEffect(() => {
        if (mode === 'edit' && specialistId && formData.title === '') { 
            setLoading(true);
            const fetchData = async () => {
                try {
                    const response = await api.get(`/specialists/${specialistId}`);
                    const data = response.data.data;

                    setFormData({
                        title: data.title,
                        description: data.description,
                        base_price: data.base_price ? parseFloat(data.base_price) : 0,
                        duration_days: data.duration_days,
                        is_draft: data.is_draft,
                        category: 'Incorporation', 
                        completion_time_label: `${data.duration_days} Days`
                    });

                    // Load MOCK images into slots based on existence of backend data
                    if (data.media && data.media.length > 0) {
                        const newSlots = [...mediaSlots];
                        // If data exists, mock populating slots with dummy images since real file storage isn't implemented
                        newSlots[0].preview = "https://via.placeholder.com/400x300/E0E0E0/222222?text=Image+1";
                        if(data.media.length > 1) newSlots[1].preview = "https://via.placeholder.com/400x300/E0E0E0/222222?text=Image+2";
                        if(data.media.length > 2) newSlots[2].preview = "https://via.placeholder.com/400x300/E0E0E0/222222?text=Image+3";
                        setMediaSlots(newSlots);
                    }

                } catch (error) {
                    console.error('Fetch Error:', error);
                    setSubmissionError('Failed to load specialist data.');
                    router.push('/admin/specialists');
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [mode, specialistId, router]); // Dependency array

    // HANDLERS
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'base_price' ? parseFloat(value) : value }));
    };

    const handleSelectChange = (e: any) => { // SelectChangeEvent generic handling
         const { name, value } = e.target;
         setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Single File Handler per Slot
    const handleFileChange = (slotId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                 alert('File max 4MB'); return;
            }
            const preview = URL.createObjectURL(file);
            setMediaSlots(prev => prev.map(slot => slot.id === slotId ? { ...slot, file, preview } : slot));
        }
    };

    const removeFile = (slotId: number) => {
        setMediaSlots(prev => prev.map(slot => slot.id === slotId ? { ...slot, file: null, preview: null } : slot));
    };

    const handleFormSubmit = async (e?: React.FormEvent, publishAction: boolean = false) => {
        if (e) e.preventDefault();
        setLoading(true);
        setSubmissionError(null);

        try {
            // Validation
            if (!formData.title || !formData.description) {
                 throw new Error('Title and description are required.');
            }

            // Construct Media Payload
            const mediaPayload: MediaPayload[] = mediaSlots
                .filter(s => s.file || s.preview) // Has file or existing preview
                .map((s, i) => ({
                    file_name: s.file ? s.file.name : `existing_img_${i}.png`, 
                    mime_type: s.file ? s.file.type : 'image/png', 
                    file_size: s.file ? s.file.size : 1024, 
                    display_order: i + 1 
                }));

            const submissionData = {
                ...formData,
                media: mediaPayload
            };

            const url = mode === 'edit' ? `/specialists/${specialistId}` : '/specialists';
            let response; 
            
            if (mode === 'create') {
                response = await api.post(url, submissionData);
            } else {
                response = await api.put(url, submissionData);
            }
            
            const savedId = response.data.data.id;

            if (publishAction) {
                await api.patch(`/specialists/${savedId}/publish`);
                setFormData(prev => ({ ...prev, is_draft: false }));
            }
            
            if (mode === 'create') {
                router.push(`/admin/specialists/edit/${savedId}`);
            }

        } catch (error: any) {
            setSubmissionError(typeof error === 'string' ? error : error?.message || 'Error occurred');
        } finally {
            setLoading(false);
            setShowPublishModal(false);
        }
    };

    const triggerPublishFlow = () => {
        if(mode === 'create' || !specialistId) {
             alert('Please save the specialist before publishing.');
             return;
        }
        setShowPublishModal(true);
    };

    if (loading && mode === 'edit' && formData.title === '') return <CircularProgress className="m-10"/>; 
    
    return (
        <div className="min-h-full pb-20">
            {/* Modal */}
            <ConfirmationModal 
                open={showPublishModal}
                title="Publish changes"
                message="Do you want to publish these changes? It will appear in the marketplace listing"
                onCancel={() => setShowPublishModal(false)}
                onConfirm={() => handleFormSubmit(undefined, true)}
                confirmText="Save changes"
            />

            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-white pt-2 pb-6 z-10 border-b border-dashed border-zinc-200 mb-6">
                <Typography variant="h5" className="text-3xl font-semibold text-text-primary font-sans">
                   {formData.title || 'New Service Listing'}
                </Typography>
                
                <div className="flex space-x-2">
                    <Button 
                        variant="outlined" 
                        onClick={() => handleFormSubmit()} 
                        disabled={loading}
                        sx={{ borderRadius: '6px', borderColor: '#D1D5DB' }}
                    >
                        Save
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={triggerPublishFlow}
                        disabled={loading || mode === 'create' || !formData.is_draft} 
                        sx={{ 
                            borderRadius: '6px', 
                            bgcolor: formData.is_draft ? '#00244F' : '#4CAF50', 
                            '&:hover': { bgcolor: formData.is_draft ? '#0D47A1' : '#388E3C' }
                        }}
                    >
                        {formData.is_draft ? 'Publish' : 'Published'}
                    </Button>
                </div>
            </div>
            
            <form className="flex space-x-8">
                {/* LEFT: Inputs */}
                <div className="flex-1 space-y-10 max-w-4xl">
                    
                    {submissionError && <Typography color="error" className='p-3 border border-red-200 bg-red-50 rounded'>{submissionError}</Typography>}

                    <div className='space-y-4'>
                        <Typography className='uppercase text-xs font-bold text-zinc-400 tracking-wide'>Service Details</Typography>
                        <TextField fullWidth label="Service Title" name="title" value={formData.title} onChange={handleInputChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                    
                        <TextField fullWidth multiline rows={4} label="Description" name="description" value={formData.description} onChange={handleInputChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}/>
                        <div className="text-right text-xs text-zinc-400">(500 words)</div>
                    </div>
                    
                    {/* Time & Category Row */}
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

                    {/* Image Upload Grid - Module 3 Style (3 Boxes) */}
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

                {/* RIGHT: Price Panel */}
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
