'use client';

import React from 'react';
import { Dialog, DialogContent, Typography, Button, Box } from '@mui/material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

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
                    maxWidth: '450px',
                    width: '100%',
                }
            }}
        >
            <DialogContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CircleNotificationsIcon sx={{ color: 'primary.main', fontSize: 32, mt: 0.5 }} />
                <Box>
                    <Typography variant="h6" className="font-bold text-text-primary mb-1">
                        {title}
                    </Typography>
                    <Typography variant="body2" className="text-zinc-500 mb-6">
                        {message}
                    </Typography>
                    <div className="flex justify-end space-x-2">
                        <Button 
                            variant="outlined" 
                            onClick={onCancel}
                            sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 600 }}
                        >
                            {cancelText}
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={onConfirm}
                            sx={{ borderRadius: '6px', bgcolor: '#00244F', textTransform: 'none', fontWeight: 600 }}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationModal;