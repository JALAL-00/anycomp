// frontend/src/components/specialists/SpecialistForm.tsx (FINAL CLEAN-UP CODE)
'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Typography, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import ProfessionalFeeCard from './ProfessionalFeeCard';
import AdditionalOfferingsSection from './AdditionalOfferingsSection';
import ProfileCardSection from './ProfileCardSection';
import api from '@/lib/api';

// Interface for Media payload (For API submission)
interface MediaPayload { file_name: string; mime_type: string; file_size: number; display_order: number; }
interface FormState {
    title: string; description: string; base_price: number; duration_days: number;
    is_draft?: boolean; mediaFile: File | null; mediaPreviewUrl: string | null;
}
const initialFormState: FormState = { title: '', description: '', base_price: 1800, duration_days: 7, is_draft: true, mediaFile: null, mediaPreviewUrl: null, };

interface SpecialistFormProps {
    mode: 'create' | 'edit';
    specialistId?: string; 
}

const SpecialistForm: React.FC<SpecialistFormProps> = ({ mode, specialistId }) => {
    const router = useRouter(); 
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    // Calculated field logic (Remains the same)
    const SERVICE_FEE_RATE = 0.3; 
    const serviceFee = formData.base_price * SERVICE_FEE_RATE;
    const totalFee = formData.base_price + serviceFee;
    const yourReturns = totalFee * (1 - SERVICE_FEE_RATE);

    // --- EFFECT: FETCH DATA FOR EDIT MODE (Final Fix - Use a simple check) ---
    useEffect(() => {
        if (mode === 'edit' && specialistId && formData.title === '') { // Only fetch if form is blank
            setLoading(true);
            const fetchData = async () => {
                try {
                    const response = await api.get(`/specialists/${specialistId}`);
                    const specialistData = response.data.data;

                    setFormData({
                        title: specialistData.title,
                        description: specialistData.description,
                        base_price: specialistData.base_price ? parseFloat(specialistData.base_price) : 0,
                        duration_days: specialistData.duration_days,
                        is_draft: specialistData.is_draft,
                        mediaFile: null,
                        mediaPreviewUrl: specialistData.media?.[0]?.file_name ? `https://via.placeholder.com/320x320/FF6347/FFFFFF?text=Saved+Image` : null, // MOCK saved image
                    });
                } catch (error) {
                    console.error('Fetch Error:', error);
                    setSubmissionError('Failed to load specialist data for editing.');
                    router.push('/admin/specialists');
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [mode, specialistId, router]);


    // HANDLERS (Simplified) ...

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'base_price' || name === 'duration_days' ? parseFloat(value) : value,
        }));
    };
    
    // Handler for actual file upload input (Logic remains the same)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 4 * 1024 * 1024) {
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({ 
                ...prev, 
                mediaFile: file,
                mediaPreviewUrl: previewUrl,
            }));
        } else {
             if (file) alert('File must be an image and under 4MB.');
             e.target.value = '';
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSubmissionError(null);

        try {
            // ... (Basic Frontend Validation remains the same) ...
            if (!formData.title || !formData.description || !formData.base_price) {
                 setSubmissionError('Title, description, and base price are required to create a specialist.');
                 setLoading(false);
                 return;
            }

            // 1. Construct Media Payload (Logic remains the same)
            let mediaPayload: MediaPayload[] = [];
            // ... (media payload construction remains the same) ...
            if (formData.mediaFile) {
                mediaPayload = [{ file_name: formData.mediaFile.name, mime_type: formData.mediaFile.type, file_size: formData.mediaFile.size, display_order: 1 }];
            } else if (formData.mediaPreviewUrl && mode === 'edit') {
                 // Send existing metadata if the form is in edit mode and a preview exists
                 mediaPayload = [{ file_name: 'existing_image.png', mime_type: 'image/png', file_size: 100000, display_order: 1, }];
            }

            // 2. Construct Final Submission Body (Logic remains the same)
            const submissionData = {
                title: formData.title, description: formData.description, base_price: formData.base_price, duration_days: formData.duration_days, is_draft: formData.is_draft, media: mediaPayload
            };

            // 3. API Call
            let response;
            const url = mode === 'edit' ? `/specialists/${specialistId}` : '/specialists';
            
            if (mode === 'create') {
                response = await api.post(url, submissionData);
            } else {
                response = await api.put(url, submissionData);
            }
            
            // 4. Success and Redirect 
            const newId = response.data.data.id;
            
            if (mode === 'create') {
                router.push(`/admin/specialists/edit/${newId}`); // Redirect to EDIT mode for seamless flow
            } else {
                 setFormData(prev => ({ ...prev, is_draft: response.data.data.is_draft })); 
                 // Success alert
            }
        } catch (error: any) {
            console.error('Submission Error:', error);
            setSubmissionError(error || 'An unexpected error occurred during submission.');
        } finally {
            setLoading(false);
        }
    };

    // PUBLISH Logic (Remains the same) ...

    const handlePublish = async () => {
        if (!specialistId) return;
        
        if (!formData.title || !formData.description || !formData.base_price) {
             alert('Please fill in required fields before publishing.');
             return;
        }

        setLoading(true);
        try {
            await api.patch(`/specialists/${specialistId}/publish`);
            setFormData(prev => ({ ...prev, is_draft: false })); 
            alert('Specialist published successfully!');
        } catch (error) {
            setSubmissionError('Failed to publish specialist.');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle loading states
    if (loading && mode === 'edit' && formData.title === '') {
        return <CircularProgress />; 
    }
    
    const mainUploadedImage = formData.mediaPreviewUrl; // The currently uploaded URL or saved URL

    return (
        <div className="min-h-full">
            
            {/* Header (Top of form - Page Title & Buttons) */}
            <div className="flex items-center justify-between sticky top-0 bg-white pt-2 pb-6 z-10">
                <Typography variant="h5" className="text-3xl font-semibold text-text-primary font-sans">
                    Register a new company | Private Limited - Sdn Bhd
                </Typography>
                
                {/* Edit/Publish Buttons (Figma Look) */}
                <div className="flex space-x-2">
                    {/* The EDIT button now triggers the form's SAVE action for Page 3 visualization */}
                    <Button 
                        variant="outlined" 
                        onClick={handleSubmit} // Triggers SAVE/PUT request
                        disabled={loading}
                        sx={{ borderRadius: '6px', height: '40px', borderColor: '#D1D5DB' }}
                    >
                        Edit
                    </Button>
                    {/* PUBLISH Button */}
                    <Button 
                        variant="contained" 
                        onClick={handlePublish} // Triggers PUBLISH
                        disabled={loading || mode === 'create'} // Disable if ID doesn't exist
                        sx={{ 
                            borderRadius: '6px', 
                            height: '40px', 
                            bgcolor: formData.is_draft ? '#00244F' : '#607D8B', // Grey/Blue visual distinction
                            '&:hover': { bgcolor: '#0D47A1' } 
                        }}
                    >
                        {formData.is_draft ? 'Publish' : 'Published'}
                    </Button>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex space-x-6">
                
                {/* LEFT COLUMN: Main Form Content */}
                <div className="flex-1 space-y-10 max-w-4xl">
                    
                    {/* Error Display (FIXED STYLING) */}
                    {submissionError && (
                        <div className='py-3 px-4 border border-accent-red bg-accent-red/10 rounded-lg'>
                           <Typography color="error" className='font-medium text-sm text-accent-red'>
                              {submissionError}
                           </Typography>
                        </div>
                    )}

                    {/* 1. Image Upload & Image Grid (FINAL CORRECTED MATCH - 1:2 Vertical/Vertical Ratio) */}
                    <div className="flex space-x-4">
                        {/* W-1/3: Image Upload Area (Actual File Input) */}
                        <label className="w-1/3 border border-zinc-200 h-80 rounded-lg flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 cursor-pointer relative overflow-hidden">
                             <input type="file" name="media" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} />
                             {mainUploadedImage ? (
                                <img src={mainUploadedImage} alt="Service Preview" className="absolute w-full h-full object-cover" />
                             ) : (
                                <div className="text-center text-zinc-500 p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L20 20M5 13l4-4M15 8h.01M21 16l-3-3" />
                                    </svg>
                                    <Typography className="text-xs max-w-[200px] mx-auto">Upload an image for your service listing in PNG, JPG or JPEG up to 4MB</Typography>
                                </div>
                             )}
                        </label>
                        
                        {/* W-2/3: The Image Grid (MOCKUP TOP/BOTTOM SLOTS) */}
                        <div className='w-2/3 flex flex-col justify-between space-y-4 h-80'> 
                            {/* Figma Mockup Top Slot (Always Mock) */}
                            <img src='https://via.placeholder.com/400x150/000000/FFFFFF?text=Mockup+Top' alt="Mockup Top" className="h-1/2 w-full object-cover rounded-lg shadow-md" style={{ maxHeight: 'calc(50% - 8px)' }} />
                            {/* Figma Mockup Bottom Slot (Always Mock) */}
                            <img src='https://via.placeholder.com/400x150/B71C1C/FFFFFF?text=Mockup+Bottom' alt="Mockup Bottom" className="h-1/2 w-full object-cover rounded-lg shadow-md" style={{ maxHeight: 'calc(50% - 8px)' }} />
                        </div>
                    </div>
                    
                    {/* 2. Description Section (Title/Description) */}
                    <div className='space-y-4'>
                        <TextField fullWidth label="Service Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter the title for your service" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} required />
                        
                        <Typography variant="h6" className='font-semibold text-text-primary'>Description</Typography>
                        <Typography variant="body2" className='text-zinc-500'>Describe your service here</Typography>
                        <TextField fullWidth multiline rows={4} name="description" value={formData.description} onChange={handleInputChange} placeholder="Detailed service description..." variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}/>
                    </div>

                    {/* 3. Additional Offerings */}
                    <div className='space-y-4'>
                        <Typography variant="h6" className='font-semibold text-text-primary'>Additional Offerings</Typography>
                        <Typography variant="body2" className='text-zinc-500 mb-2'>Enhance your service by adding additional offerings.</Typography>
                        <AdditionalOfferingsSection />
                    </div>

                    {/* 4. Company Secretary (Profile Section) */}
                    <ProfileCardSection />

                    <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 6, height: '48px', bgcolor: '#00244F', '&:hover': { bgcolor: '#0D47A1' }, borderRadius: '6px' }}>
                        {loading ? <CircularProgress size={24} color='inherit' /> : (mode === 'create' ? 'Create Specialist' : 'Save Changes')}
                    </Button>
                </div>

                
                {/* RIGHT COLUMN: Fixed Price Panel (Matching Figma Look) */}
                <div className="w-[300px] flex-shrink-0">
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