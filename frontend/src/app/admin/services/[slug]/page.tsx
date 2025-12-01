'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Typography, CircularProgress, Paper, Divider } from '@mui/material';
import { Specialist as SpecialistType } from '@/store/specialistSlice';
import EditServiceDrawer from '@/components/specialists/EditServiceDrawer';
import AdditionalOfferingsSection from '@/components/specialists/AdditionalOfferingsSection';
import ProfileCardSection from '@/components/specialists/ProfileCardSection';
import api from '@/lib/api';

export default function ServiceDetailsPage() {
    const router = useRouter();
    const params = useParams() as { slug: string };

    const [service, setService] = useState<SpecialistType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (params.slug) {
            const fetchService = async () => {
                try {
                    setLoading(true);
                    const response = await api.get(`/specialists/${params.slug}`);
                    setService(response.data.data);
                } catch (err) {
                    setError('Failed to fetch service details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchService();
        }
    }, [params.slug]);

    const handleEditSuccess = (updatedService: SpecialistType) => {
      setService(updatedService);
      setDrawerOpen(false);
      if (updatedService.slug !== params.slug) {
          router.replace(`/admin/services/${updatedService.slug}`);
      }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><CircularProgress /></div>;
    if (error) return <Typography color="error" className="text-center">{error}</Typography>;
    if (!service) return <Typography className="text-center">Service not found.</Typography>;

    const primaryImage = service.media?.[0]?.file_name;
    const secondaryImages = service.media?.slice(1, 3) || [];

    const basePriceNum = parseFloat(String(service.base_price) || '0');
    const platformFeeNum = parseFloat(String(service.platform_fee) || '0');
    const finalPriceNum = parseFloat(String(service.final_price) || '0');

    return (
        <div className="pb-20">
            {isDrawerOpen && <EditServiceDrawer service={service} open={isDrawerOpen} onClose={() => setDrawerOpen(false)} onSaveSuccess={handleEditSuccess} />}
            
            {/* The incorrect header block has been removed from this section */}
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h4" className="font-bold text-text-primary">
                    {service.title}
                </Typography>
                <div className="flex space-x-3">
                    <Button variant="outlined" sx={{ borderRadius: '6px', borderColor: '#00244F', color: '#00244F' }} onClick={() => setDrawerOpen(true)}>Edit</Button>
                    <Button variant="contained" sx={{ borderRadius: '6px', bgcolor: '#00244F' }}>Publish</Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    <div className="flex h-[400px] gap-4">
                        <div className="w-2/3">
                             <img src={primaryImage || "https://via.placeholder.com/800x600/F0F0F0/BDBDBD?text=Primary+Image"} alt={service.title} className="w-full h-full object-cover rounded-lg shadow-md" />
                        </div>
                        <div className="w-1/3 flex flex-col gap-4">
                            <img src={secondaryImages[0]?.file_name || "https://via.placeholder.com/400x300/F0F0F0/BDBDBD?text=Image+2"} alt="Secondary" className="w-full h-1/2 object-cover rounded-lg shadow-md" />
                            <img src={secondaryImages[1]?.file_name || "https://via.placeholder.com/400x300/F0F0F0/BDBDBD?text=Image+3"} alt="Tertiary" className="w-full h-1/2 object-cover rounded-lg shadow-md" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Typography variant="h6" className='font-semibold'>Description</Typography>
                        <Typography className="text-zinc-500 leading-relaxed pt-2 border-t">
                            {service.description}
                        </Typography>
                    </div>

                    <div className="space-y-2">
                        <Typography variant="h6" className='font-semibold'>Additional Offerings</Typography>
                         <div className="pt-4 border-t"><AdditionalOfferingsSection /></div>
                    </div>
                    
                    <ProfileCardSection />

                </div>

                <div className="col-span-4">
                     <Paper variant="outlined" className="p-6 sticky top-6">
                        <Typography variant="h6" className="font-semibold mb-1">Professional Fee</Typography>
                        <Typography variant="body2" className="text-zinc-500 mb-4">Set a rate for your service</Typography>
                        <Typography variant="h3" className="font-bold my-4 text-center border-b pb-4">
                            RM {basePriceNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
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