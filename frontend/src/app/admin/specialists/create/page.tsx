'use client';

import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, CircularProgress, Paper, Divider, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AdditionalOfferingsSection from '@/components/specialists/AdditionalOfferingsSection';
import ProfileCardSection from '@/components/specialists/ProfileCardSection';
import api from '@/lib/api';

// Reusable EditableImage Component
const EditableImage = ({ src, alt, onImageUpload }: { src?: string; alt: string; onImageUpload: (file: File) => void; }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleContainerClick = () => { if (isUploading) return; inputRef.current?.click(); };
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setIsUploading(true); try { await onImageUpload(file); } finally { setIsUploading(false); } }
    };

    return (<Box onClick={handleContainerClick} sx={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer', bgcolor: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', '&:hover .overlay': { opacity: 1 }, border: '2px dashed #e2e8f0' }}><input type="file" ref={inputRef} onChange={handleFileChange} hidden accept="image/*" />{src ? (<img src={src} alt={alt} className="w-full h-full object-cover" />) : (<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', p: 2, textAlign: 'center' }}><Typography variant="body2">Click to upload</Typography></Box>)}<div className="overlay absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold opacity-0 transition-opacity pointer-events-none">{isUploading ? <CircularProgress color="inherit" size={24}/> : 'Change Image'}</div></Box>);
};

export default function CreateServicePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [durationDays, setDurationDays] = useState(7);
    const [companyType, setCompanyType] = useState('Private Limited - Sdn. Bhd'); // Add state for company type
    const [basePrice, setBasePrice] = useState(1800);
    const [images, setImages] = useState<(File | null)[]>([null, null, null]);
    const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (file: File, index: number) => {
        const newImages = [...images]; newImages[index] = file; setImages(newImages);
        const newPreviews = [...previews]; newPreviews[index] = URL.createObjectURL(file); setPreviews(newPreviews);
    };

    const handleSave = async () => {
        if (!title || !description) { setError("Title and Description are required."); return; }
        setLoading(true);
        setError(null);

        const submissionData = new FormData();
        submissionData.append('title', title);
        submissionData.append('description', description);
        submissionData.append('base_price', String(basePrice));
        submissionData.append('duration_days', String(durationDays));
        // We can add companyType to submissionData if the backend needs it
        // submissionData.append('company_type', companyType);
        images.forEach((file) => { if (file) { submissionData.append('images', file); } });
        
        try {
            await api.post('/specialists', submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
            router.push('/admin/specialists');
        } catch (err: any) {
            setError(err.message || "Failed to create service.");
        } finally {
            setLoading(false);
        }
    };

    const serviceFee = basePrice * 0.20;
    const totalFee = basePrice + serviceFee;

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h4" className="font-bold text-text-primary">Create New Service</Typography>
                <Button variant="contained" sx={{ borderRadius: '6px', bgcolor: '#00244F' }} onClick={handleSave} disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Save & Create"}
                </Button>
            </div>

            {error && <Typography color="error" className="bg-red-50 p-3 rounded-md mb-4">{error}</Typography>}

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    <TextField fullWidth required label="Service Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <div className="flex h-[400px] gap-4">
                        <div className="w-2/3"><EditableImage src={previews[0] || undefined} alt="Primary Image" onImageUpload={(file) => handleImageUpload(file, 0)} /></div>
                        <div className="w-1/3 flex flex-col gap-4">
                            <div className="h-1/2"><EditableImage src={previews[1] || undefined} alt="Secondary Image" onImageUpload={(file) => handleImageUpload(file, 1)} /></div>
                            <div className="h-1/2"><EditableImage src={previews[2] || undefined} alt="Tertiary Image" onImageUpload={(file) => handleImageUpload(file, 2)} /></div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Typography variant="h6" className='font-semibold'>Description</Typography>
                        <TextField fullWidth multiline rows={4} label="Service Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    
                    <div className="flex space-x-4">
                        <FormControl fullWidth>
                            <InputLabel>Estimated Completion Time</InputLabel>
                            <Select value={durationDays} label="Estimated Completion Time" onChange={(e) => setDurationDays(e.target.value as number)}>
                                <MenuItem value={1}>1 Day</MenuItem>
                                <MenuItem value={3}>3 Days</MenuItem>
                                <MenuItem value={4}>4 Days</MenuItem>
                                <MenuItem value={7}>7 Days</MenuItem>
                                <MenuItem value={10}>10 Days</MenuItem>
                                <MenuItem value={14}>14 Days</MenuItem>
                                <MenuItem value={30}>30 Days</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                             <InputLabel>Supported Company Types</InputLabel>
                            <Select value={companyType} label="Supported Company Types" onChange={(e) => setCompanyType(e.target.value as string)}>
                                <MenuItem value="Private Limited - Sdn. Bhd">Private Limited - Sdn. Bhd</MenuItem>
                                <MenuItem value="Public Limited - Bhd">Public Limited - Bhd</MenuItem>
                                <MenuItem value="Limited Liability Partnership - LLP">Limited Liability Partnership - LLP</MenuItem>
                                <MenuItem value="Sole Proprietorship">Sole Proprietorship</MenuItem>
                                <MenuItem value="Partnership">Partnership</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="space-y-2"><Typography variant="h6" className='font-semibold'>Additional Offerings</Typography><div className="pt-4 border-t"><AdditionalOfferingsSection /></div></div>
                    <ProfileCardSection />
                </div>
                
                <div className="col-span-4">
                     <Paper variant="outlined" className="p-6 sticky top-6">
                        <Typography variant="h6" className="font-semibold mb-1">Professional Fee</Typography>
                        <Typography variant="body2" className="text-zinc-500 mb-4">Set a rate for your service</Typography>
                        <Typography variant="h3" className="font-bold my-4 text-center border-b pb-4">RM {basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
                        <TextField fullWidth label="Base Price" type="number" value={basePrice} onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)} sx={{ my: 2 }}/>
                        <div className="space-y-2 mt-4 text-sm">
                           <div className='flex justify-between'><span className="text-zinc-600">Base price</span><span className="font-medium">RM {basePrice.toFixed(2)}</span></div>
                           <div className='flex justify-between'><span className="text-zinc-600">Service processing fee</span><span className="font-medium">RM {serviceFee.toFixed(2)}</span></div>
                           <div className='flex justify-between font-bold text-base mt-2 pt-2 border-t'><span >Total</span><span>RM {totalFee.toFixed(2)}</span></div>
                           <div className='flex justify-between font-bold text-green-600 mt-1'><span >Your returns</span><span>RM {basePrice.toFixed(2)}</span></div>
                        </div>
                    </Paper>
                </div>
            </div>
        </div>
    );
}
