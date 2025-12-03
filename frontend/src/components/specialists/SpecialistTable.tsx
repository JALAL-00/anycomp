'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setPage, setSpecialists } from '@/store/specialistSlice';
import { useRouter } from 'next/navigation';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Checkbox, Typography, Box, IconButton
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SpecialistActions from './SpecialistActions'; 
import api from '@/lib/api';

const columns = [
  { id: 'checkbox', label: '', width: 50 },
  { id: 'service', label: 'SERVICE', width: 250 },
  { id: 'price', label: 'PRICE', width: 120 },
  { id: 'purchases', label: 'PURCHASES', width: 120 },
  { id: 'duration', label: 'DURATION', width: 120 },
  { id: 'approval_status', label: 'APPROVAL STATUS', width: 150 },
  { id: 'publish_status', label: 'PUBLISH STATUS', width: 150 },
  { id: 'action', label: 'ACTION', width: 80 },
];

const StatusChip: React.FC<{ status: string | boolean; type: 'approval' | 'publish' }> = ({ status, type }) => {
  let bgColor = '#E0E0E0';
  let label: string;

  if (type === 'approval') {
    label = String(status);
    switch (String(status).toLowerCase()) {
      case 'approved': bgColor = '#A5D6A7'; break;
      case 'rejected': bgColor = '#EF9A9A'; break;
      case 'pending': default: bgColor = '#B2EBF2'; label = 'Under Review'; break;
    }
  } else {
    label = status ? 'Published' : 'Not Published';
    bgColor = status ? '#4CAF50' : '#D32F2F';
  }

  const isSolid = type === 'publish'; 
  
  return (
    <Box sx={{ 
        bgcolor: bgColor, 
        color: isSolid ? 'white' : '#222', 
        borderRadius: '4px', py: 0.5, px: 1.5,
        display: 'inline-block', fontSize: '0.75rem', fontWeight: 600,
        textAlign: 'center', minWidth: '90px'
    }}>
        {label}
    </Box>
  );
};

const SpecialistTable: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { list, total, page, limit, loading } = useSelector((state: RootState) => state.specialists);
  const [selected, setSelected] = useState<string[]>([]);

  const handleDeleteSpecialist = async (id: string) => {
      try {
        await api.delete(`/specialists/${id}`);
        const newList = list.filter(item => item.id !== id);
        dispatch(setSpecialists({ data: newList, total: total - 1, page, limit }));
      } catch (error) {
        alert("Failed to delete specialist");
      }
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;
  const totalPages = Math.ceil(total / limit);

  const handleRowClick = (slug: string) => {
    router.push(`/admin/services/${slug}`);
  };

  const renderPagination = () => (
      <div className="flex items-center justify-center p-6 space-x-2">
        <IconButton onClick={() => dispatch(setPage(Math.max(1, page - 1)))} disabled={page === 1} size="small">
            <NavigateBeforeIcon />
            <Typography variant="body2" className="ml-1 font-semibold">Previous</Typography>
        </IconButton>
        {[...Array(totalPages)].map((_, i) => {
             const pageNum = i + 1;
             return (
                <button
                    key={pageNum} onClick={() => dispatch(setPage(pageNum))}
                    className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center transition-colors
                        ${page === pageNum ? 'bg-[#00244F] text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                    {pageNum}
                </button>
             );
        })}
        <IconButton onClick={() => dispatch(setPage(Math.min(totalPages, page + 1)))} disabled={page === totalPages} size="small">
            <Typography variant="body2" className="mr-1 font-semibold">Next</Typography>
            <NavigateNextIcon />
        </IconButton>
      </div>
  );

  return (
    <Paper className="w-full shadow-none border border-zinc-200" sx={{ borderRadius: '12px' }}>
      <TableContainer>
        <Table className='min-w-[900px]'>
          <TableHead>
            <TableRow>{columns.map((column) => (<TableCell key={column.id} width={column.width} sx={{ fontWeight: 600, color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase', bgcolor: '#F9FAFB' }}>
                  {column.id === 'checkbox' ? <Checkbox size='small' /> : column.label}
                </TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={8} align="center" className="py-10">Loading...</TableCell></TableRow>) : 
            list.map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow hover key={row.id} selected={isItemSelected} sx={{ '&.Mui-selected': { bgcolor: '#F0F7FF' }, borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }} onClick={() => handleRowClick(row.slug)}>
                  <TableCell padding="checkbox"><Checkbox size='small' checked={isItemSelected} onClick={(e) => { e.stopPropagation(); setSelected(prev => isItemSelected ? prev.filter(i => i !== row.id) : [...prev, row.id])}} /></TableCell>
                  <TableCell><Typography className="font-semibold text-sm">{row.title}</Typography></TableCell>
                  <TableCell>RM {row.final_price ? parseFloat(String(row.final_price)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</TableCell>
                  <TableCell>{row.purchases}</TableCell>
                  <TableCell>{row.duration_days} Days</TableCell>
                  <TableCell><StatusChip status={row.verification_status} type='approval' /></TableCell>
                  <TableCell><StatusChip status={!row.is_draft} type='publish' /></TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <SpecialistActions specialistId={row.id} slug={row.slug} onDelete={handleDeleteSpecialist} />
                  </TableCell>
                </TableRow>);})}
          </TableBody>
        </Table>
      </TableContainer>
      {total > 0 && renderPagination()}
    </Paper>
  );
};

export default SpecialistTable;
