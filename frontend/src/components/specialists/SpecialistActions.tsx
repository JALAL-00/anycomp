// src/components/specialists/SpecialistActions.tsx (NEW FILE)
'use client';

import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Link from 'next/link';

interface SpecialistActionsProps {
    specialistId: string;
    // We only implement Edit/Delete/Publish here, the logic for delete/publish 
    // will be added in Module 5 (the logic is handled via forms/patches).
    onDelete: (id: string) => void;
}

/**
 * Renders the Edit/Delete/Publish action menu for a specialist table row.
 * Matches the Figma's dropdown menu visual.
 */
const SpecialistActions: React.FC<SpecialistActionsProps> = ({ specialistId, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        handleClose();
        // Prompt for confirmation before calling delete (best UX practice)
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
                sx={{ color: 'var(--tw-colors-text-primary)' }}
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
                // Custom styles to match the menu drop shadow and corner radius
                PaperProps={{
                    elevation: 1,
                    sx: {
                        borderRadius: '8px', 
                        minWidth: '150px',
                        mt: 0.5,
                        // Ensure the drop shadow is visible
                    },
                }}
            >
                {/* Edit Action (Navigates to Page 3: /admin/specialists/edit/:id) */}
                <MenuItem component={Link} href={`/admin/specialists/edit/${specialistId}`}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                
                {/* Delete Action */}
                <MenuItem onClick={handleDelete} className='text-red-600'>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" className='text-red-600' />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default SpecialistActions;