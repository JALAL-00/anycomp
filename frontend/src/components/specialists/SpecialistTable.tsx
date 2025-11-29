// src/components/specialists/SpecialistTable.tsx (FINAL CORRECTED CODE)
'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store'; // <-- Added AppDispatch
import { setPage, Specialist } from '@/store/specialistSlice';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Checkbox, Typography, Chip, IconButton, 
    TablePagination
} from '@mui/material';
// FIX: Correctly imported SpecialistActions
import SpecialistActions from './SpecialistActions'; 
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';

// Column headers matching Figma
const columns = [
  { id: 'checkbox', label: '', width: 30 },
  { id: 'service', label: 'SERVICE', width: 200 },
  { id: 'price', label: 'PRICE', width: 100 },
  { id: 'purchases', label: 'PURCHASES', width: 100 },
  { id: 'duration', label: 'DURATION', width: 100 },
  { id: 'approval_status', label: 'APPROVAL STATUS', width: 150 },
  { id: 'publish_status', label: 'PUBLISH STATUS', width: 150 },
  { id: 'action', label: 'ACTION', width: 80 },
];

/**
 * Renders the Chip/Badge based on status color requirements.
 */
const StatusChip: React.FC<{ status: string; type: 'approval' | 'publish' }> = ({ status, type }) => {
  let colorClass: string;
  let label: string;

  if (type === 'approval') {
    switch (status.toLowerCase()) {
      case 'approved':
        colorClass = 'bg-accent-green text-white';
        label = 'Approved';
        break;
      case 'rejected':
        colorClass = 'bg-accent-red text-white';
        label = 'Rejected';
        break;
      case 'pending':
      default:
        colorClass = 'bg-accent-cyan text-white';
        label = 'Under Review';
        break;
    }
  } else { // publish
    label = status.toLowerCase() === 'published' ? 'Published' : 'Not Published';
    colorClass = status.toLowerCase() === 'published' ? 'bg-accent-green/80 text-white' : 'bg-accent-red/80 text-white';
  }

  return (
    <Chip 
      label={label} 
      size="small" 
      className={`font-semibold ${colorClass}`} 
      sx={{ 
          borderRadius: '4px', // Match Figma's square look
          height: '24px', 
          fontSize: '0.7rem',
          backgroundColor: status.toLowerCase() === 'published' ? '#4CAF50' : status.toLowerCase() === 'not published' ? '#E53935' : undefined,
          color: 'white',
          // Override default MUI button shadows/styles
          '&.bg-accent-cyan': { backgroundColor: '#00BCD4' },
          '&.bg-accent-red': { backgroundColor: '#E53935' },
          '&.bg-accent-green': { backgroundColor: '#4CAF50' },
      }}
    />
  );
};


/**
 * Renders the main table of specialists with pagination.
 */
const SpecialistTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // <-- Correct dispatch typing
  const { list, total, page, limit, loading } = useSelector((state: RootState) => state.specialists);
  const [selected, setSelected] = useState<string[]>([]);
  
  // Placeholder Delete Handler (Will be fully implemented in Module 5)
  const handleDeleteSpecialist = (id: string) => {
    console.log(`Deleting specialist with ID: ${id}`);
    // NOTE: Full API call and Redux state update will go here in Module 5
  }

  // Handlers for selection
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = list.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Pagination Handler
  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1)); // newPage is 0-indexed, state page is 1-indexed
  };
  

  if (loading) return <Typography variant="h6" className='text-center py-10'>Loading Specialists...</Typography>;
  if (total === 0) return <Typography variant="h6" className='text-center py-10'>No specialists found matching the current criteria.</Typography>;

  return (
    <Paper className="w-full overflow-hidden shadow-none border border-zinc-200" sx={{ borderRadius: '8px' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="specialists table" className='bg-white'>
          <TableHead className='bg-zinc-50'>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={'left'}
                  style={{ minWidth: column.width }}
                  className='bg-zinc-50 font-sans font-semibold text-sm text-zinc-600'
                  sx={{ 
                    bgcolor: '#F9FAFB', 
                    padding: '12px 16px',
                    color: 'var(--tw-colors-text-primary)', // Ensure color is applied
                    borderBottom: '1px solid #E5E7EB'
                  }}
                >
                  {column.id === 'checkbox' ? (
                    <Checkbox
                      color="primary"
                      indeterminate={selected.length > 0 && selected.length < list.length}
                      checked={list.length > 0 && selected.length === list.length}
                      onChange={handleSelectAllClick}
                      size='small'
                    />
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow
                  hover
                  onClick={() => handleClick(row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{
                    '&.Mui-selected': { 
                      backgroundColor: 'rgba(10, 102, 194, 0.08)' // primary-blue with transparency
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer'
                  }}
                >
                  <TableCell padding="checkbox" sx={{ padding: '12px 16px' }}>
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      size='small'
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>
                    <Typography className='font-medium text-text-primary'>
                        {row.title}
                    </Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>
                    <Typography className='font-medium text-text-primary'>RM {row.final_price?.toFixed(2) || '0.00'}</Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>{row.purchases}</TableCell>
                  <TableCell align="left" sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>{row.duration_days} Days</TableCell>
                  <TableCell align="left" sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>
                    <StatusChip status={row.verification_status} type='approval' />
                  </TableCell>
                  <TableCell align="left" sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>
                    <StatusChip status={row.is_draft ? 'Not Published' : 'Published'} type='publish' />
                  </TableCell>
                  <TableCell align="left" sx={{ padding: '12px 16px' }}>
                    {/* Action Menu (Final Fix) */}
                    <SpecialistActions 
                        specialistId={row.id} 
                        onDelete={handleDeleteSpecialist} 
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination (Page 1 Requirement: when rows >= 10) */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={limit}
        page={page - 1} // MUI uses 0-indexed page
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}} // Rows per page is fixed to 10 for assessment scope
        labelRowsPerPage=""
        className='bg-white'
        sx={{
          '& .MuiTablePagination-toolbar': { 
            justifyContent: 'center', 
            padding: '8px', 
            minHeight: '40px',
            '.MuiTablePagination-actions': { // Hide the actions arrows/input as per Figma
                display: 'none', 
            },
          },
          // Custom pagination display to match Figma's centered 'Previous 1 2 3...'
          '& .MuiTablePagination-displayedRows': {
             order: 2, 
             margin: '0 16px' 
          },
          '& .MuiTablePagination-selectLabel': { order: 1, display: 'none' }, // Hide label
          '& .MuiTablePagination-select': { order: 3, display: 'none' },    // Hide select
          
        }}
        // Placeholder for custom pagination UI to match Figma's exact look
        // We use the MUI component but severely restrict it to match the visual
      />

    </Paper>
  );
};

export default SpecialistTable;