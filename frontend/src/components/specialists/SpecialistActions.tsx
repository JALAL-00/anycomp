'use client';

import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Link from 'next/link';

interface SpecialistActionsProps {
    specialistId: string;
    slug: string; 
    onDelete: (id: string) => void;
}

const SpecialistActions: React.FC<SpecialistActionsProps> = ({ specialistId, slug, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation(); 
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        handleClose();
        if (window.confirm('Are you sure you want to delete this specialist?')) {
             onDelete(specialistId);
        }
    }

    return (
        <>
            <IconButton 
                size='small' 
                onClick={handleClick}
                aria-controls={open ? 'specialist-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <MoreVertIcon />
            </IconButton>
            
            <Menu
                anchorEl={anchorEl}
                id="specialist-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 1,
                    sx: {
                        borderRadius: '8px', 
                        minWidth: '150px',
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                        mt: 0.5,
                    },
                }}
            >
                <MenuItem component={Link} href={`/admin/services/${slug}`}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default SpecialistActions;