'use client';

import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Typography, CircularProgress, Paper, Divider, Box } from '@mui/material';
import { Specialist as SpecialistType } from '@/store/specialistSlice';
import EditServiceDrawer from '@/components/specialists/EditServiceDrawer';
import AdditionalOfferingsSection from '@/components/specialists/AdditionalOfferingsSection';
import ProfileCardSection from '@/components/specialists/ProfileCardSection';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import api from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

const EditableImage = ({ src, alt, onImageUpload }: { src?: string; alt: string; onImageUpload: (file: File) => void; }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleContainerClick = () => {
        if (isUploading) return;
        inputRef.current?.click();
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            try {
                await onImageUpload(file);
            } finally {
                setIsUploading(false);
            }
        }
    };
    
    const imageUrl = src ? (src.startsWith('blob:') ? src : `${API_BASE_URL}${src}`) : undefined;
    
    return (
        <Box 
            onClick={handleContainerClick}
            sx={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%',
                cursor: 'pointer',
                bgcolor: '#f1f5f9',
                borderRadius: '12px',
                overflow: 'hidden',
                '&:hover .overlay': { opacity: 1 },
                border: '2px dashed #e2e8f0',
                minHeight: '160px' // Added min-height for mobile
            }}
        >
            <input type="file" ref={inputRef} onChange={handleFileChange} hidden accept="image/*" />
            {imageUrl ? (
                 <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
            ) : (
                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">Click to upload</Typography>
                 </Box>
            )}
            <div className="overlay absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold opacity-0 transition-opacity pointer-events-none">
                {isUploading ? <CircularProgress color="inherit" size={24}/> : 'Change Image'}
            </div>
        </Box>
    );
};

export default function ServiceDetailsPage() {
    const router = useRouter();
    const params = useParams() as { slug: string };

    const [service, setService] = useState<SpecialistType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isPublishModalOpen, setPublishModalOpen] = useState(false);

    const fetchService = async (slug: string) => {
        try {
            const response = await api.get(`/specialists/${slug}`);
            setService(response.data.data);
        } catch (err) {
            setError('Failed to fetch service details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.slug) {
            setLoading(true);
            fetchService(params.slug);
        }
    }, [params.slug]);

    const handleEditSuccess = (updatedService: SpecialistType) => {
        setService(updatedService);
        setDrawerOpen(false);
        if (updatedService.slug !== params.slug) {
            router.replace(`/admin/services/${updatedService.slug}`);
        }
    };
    
    const handleImageUpload = async (file: File, displayOrder: number) => {
        if (!service) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            await api.put(`/specialists/${service.id}/media/${displayOrder}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await fetchService(params.slug);
        } catch (err) {
            console.error("Image upload failed", err);
            alert("Image upload failed. Please try again.");
        }
    };

    const handlePublish = async () => {
        if (!service) return;
        try {
            await api.patch(`/specialists/${service.id}/publish`);
            setPublishModalOpen(false);
            router.push('/specialists');
        } catch (err) {
            alert("Failed to publish the service. Please try again.");
            setPublishModalOpen(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><CircularProgress /></div>;
    if (error) return <Typography color="error" className="text-center">{error}</Typography>;
    if (!service) return <Typography className="text-center">Service not found.</Typography>;

    const mediaSlot1 = service.media?.find(m => m.display_order === 1);
    const mediaSlot2 = service.media?.find(m => m.display_order === 2);
    const mediaSlot3 = service.media?.find(m => m.display_order === 3);
    const basePriceNum = parseFloat(String(service.base_price) || '0');
    const platformFeeNum = parseFloat(String(service.platform_fee) || '0');
    const finalPriceNum = basePriceNum + platformFeeNum;

    return (
        <div className="pb-20">
            {isDrawerOpen && <EditServiceDrawer service={service} open={isDrawerOpen} onClose={() => setDrawerOpen(false)} onSaveSuccess={handleEditSuccess} />}
            <ConfirmationModal open={isPublishModalOpen} title="Publish changes" message="Do you want to publish these changes? It will appear in the marketplace listing." onConfirm={handlePublish} onCancel={() => setPublishModalOpen(false)} />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <Typography variant="h4" className="font-bold text-text-primary text-2xl md:text-3xl">{service.title}</Typography>
                <div className="flex space-x-3 w-full md:w-auto">
                    <Button variant="outlined" sx={{ borderRadius: '6px', borderColor: '#00244F', color: '#00244F', flex: 1, maxWidth: {md: '100px'} }} onClick={() => setDrawerOpen(true)}>Edit</Button>
                    <Button variant="contained" onClick={() => setPublishModalOpen(true)} disabled={!service.is_draft} sx={{ borderRadius: '6px', bgcolor: service.is_draft ? '#00244F' : '#4CAF50', '&:hover': { bgcolor: service.is_draft ? '#001a38' : '#388E3C', }, flex: 1, maxWidth: {md: '150px'} }}>
                        {service.is_draft ? 'Publish' : 'Published'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Responsive Image Layout: Stack columns on mobile, row on large screens */}
                    <div className="flex flex-col lg:flex-row h-auto lg:h-[400px] gap-4">
                        <div className="w-full lg:w-2/3 h-[250px] lg:h-full"><EditableImage src={mediaSlot1?.file_name} alt="Primary Image" onImageUpload={(file) => handleImageUpload(file, 1)} /></div>
                        <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-4 h-[150px] lg:h-full">
                            <div className="w-1/2 lg:w-full h-full lg:h-1/2"><EditableImage src={mediaSlot2?.file_name} alt="Secondary Image" onImageUpload={(file) => handleImageUpload(file, 2)} /></div>
                            <div className="w-1/2 lg:w-full h-full lg:h-1/2"><EditableImage src={mediaSlot3?.file_name} alt="Tertiary Image" onImageUpload={(file) => handleImageUpload(file, 3)} /></div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Typography variant="h6" className='font-semibold'>Description</Typography>
                        <Typography className="text-zinc-500 leading-relaxed pt-2 border-t">{service.description}</Typography>
                    </div>

                    <div className="space-y-4">
                        <Typography variant="h6" className='font-semibold'>Additional Offerings</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: -1 }}>Enhance your service by adding additional offerings</Typography>
                    </div>

                    <ProfileCardSection />
                </div>

                <div className="col-span-12 lg:col-span-4">
                     <Paper variant="outlined" className="p-6 sticky top-6">
                        <Typography variant="h6" className="font-semibold mb-1">Professional Fee</Typography>
                        <Typography variant="body2" className="text-zinc-500 mb-4">Set a rate for your service</Typography>
                        <Typography variant="h3" className="font-bold my-4 text-center border-b pb-4">RM {basePriceNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
                        <div className="space-y-2 mt-4 text-sm">
                           <div className='flex justify-between'><span className="text-zinc-600">Base price</span><span className="font-medium">RM {basePriceNum.toFixed(2)}</span></div>
                           <div className='flex justify-between'><span className="text-zinc-600">Service processing fee</span><span className="font-medium">RM {platformFeeNum.toFixed(2)}</span></div>
                           <div className='flex justify-between font-bold text-base mt-2 pt-2 border-t'><span >Total</span><span>RM {finalPriceNum.toFixed(2)}</span></div>
                           <div className='flex justify-between font-bold text-green-600 mt-1'><span >Your returns</span><span>RM {basePriceNum.toFixed(2)}</span></div>
                        </div>
                    </Paper>
                </div>
            </div>
        </div>
    );
}
