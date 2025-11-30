'use client';

import React from 'react';
import { Dialog, DialogContent, Typography, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface ConfirmationModalProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Save changes',
    cancelText = 'Continue Editing',
}) => {
    return (
        <Dialog 
            open={open} 
            onClose={onCancel}
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    padding: '16px',
                    maxWidth: '500px',
                    width: '100%',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                }
            }}
        >
            <DialogContent>
                <div className="flex items-start space-x-3 mb-2">
                    <InfoIcon className="text-primary-dark" sx={{ fontSize: 24, marginTop: '2px' }} />
                    <div>
                        <Typography variant="h6" className="font-bold text-text-primary mb-1">
                            {title}
                        </Typography>
                        <Typography variant="body2" className="text-zinc-500 mb-8">
                            {message}
                        </Typography>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button 
                        variant="outlined" 
                        onClick={onCancel}
                        sx={{ 
                            borderRadius: '6px',
                            color: '#222222',
                            borderColor: '#E5E7EB',
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        {cancelText}
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={onConfirm}
                        sx={{ 
                            borderRadius: '6px',
                            bgcolor: '#00244F', 
                            '&:hover': { bgcolor: '#0D47A1' },
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationModal;