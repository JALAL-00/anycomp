import React from "react"; 
import { Typography, Avatar, Button, Chip } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';

const ProfileCardSection: React.FC = () => {
    return (
        <div className='mt-8 pt-8 border-t border-zinc-100'>
            <Typography variant="h6" className='font-semibold text-text-primary mb-6'>Company Secretary</Typography>
            
            <div className="flex items-start space-x-4 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                <div className="relative">
                    <Avatar 
                        src="https://via.placeholder.com/150" 
                        alt="Grace Lam"
                        sx={{ width: 64, height: 64 }}
                    />
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <Typography className="font-bold text-text-primary">Grace Lam</Typography>
                        <Chip 
                            icon={<VerifiedIcon sx={{ fontSize: 14 }} />} 
                            label="Verified" 
                            size="small" 
                            color="success" 
                            className="bg-green-100 text-green-700 h-5 text-[10px] font-bold border-none"
                            sx={{ '& .MuiChip-label': { px: 1 } }}
                        />
                    </div>
                    <Typography className="text-xs text-zinc-500 mt-1">Corpsec Services Sdn Bhd</Typography>
                    <div className="flex items-center space-x-2 text-xs text-zinc-500 mt-0.5">
                        <span>250 Clients</span>
                        <span>★ 4.9</span>
                    </div>

                    <Typography className="text-xs text-zinc-600 mt-3 leading-relaxed">
                        A company secretarial service founded by Grace, who believes that every company deserves clarity, confidence, and care in their compliance journey.
                    </Typography>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-6">
                 <div>
                    <Typography className="text-sm font-semibold mb-2">Grace Lam is part of a firm</Typography>
                    <Typography className="text-xs text-zinc-500">Company Secretary firms are professional service providers that manage corporate compliance, company registration, and statutory obligations.</Typography>
                 </div>
                 
                 <div>
                    <Typography className="text-sm font-semibold mb-2">Certifications</Typography>
                    <div className="flex space-x-2">
                         <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-[8px]">SSM</div>
                         <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-[8px]">MAICSA</div>
                         <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-[8px]">MIA</div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default ProfileCardSection;