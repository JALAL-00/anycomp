'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setFilter, setSearch } from '@/store/specialistSlice';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Link from 'next/link';
import { AppDispatch } from '@/store/store'; 

const TABS: ('All' | 'Drafts' | 'Published')[] = ['All', 'Drafts', 'Published'];

const SpecialistFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentFilter = useSelector((state: RootState) => state.specialists.filter);
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    dispatch(setSearch(value));
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
      
      <div className="flex flex-col space-y-4 w-full lg:w-auto"> 
        
        <div className="flex space-x-2 border-b border-zinc-200 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => dispatch(setFilter(tab))}
              className={`pb-2 px-3 text-sm font-semibold transition-colors duration-150 whitespace-nowrap ${
                currentFilter === tab
                  ? 'text-primary-blue border-b-2 border-primary-blue'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Search Services" 
          value={localSearch}
          onChange={handleSearchChange}
          className='w-full lg:w-80' 
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className='text-zinc-400' />
              </InputAdornment>
            ),
            style: { 
                borderRadius: '6px', 
                backgroundColor: '#F4F4F4', 
                height: '40px',
                paddingLeft: '0px',
                border: '1px solid transparent' 
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: 'transparent', 
                },
                '&:hover fieldset': {
                    borderColor: 'transparent', 
                },
                '&.Mui-focused fieldset': {
                    borderColor: 'transparent', 
                    boxShadow: '0 0 0 1px #0A66C2', 
                },
            },
            '& .MuiInputBase-root': {
              paddingLeft: '8px', 
              '& .MuiInputBase-input': {
                padding: '8px 14px',
              },
            },
            '& .MuiInputLabel-root': { 
                display: 'none', 
            }
          }}
        />
      </div>
      <div className="flex space-x-3 mt-0 w-full lg:w-auto"> 
        <Link href="/admin/specialists/create" passHref className="flex-1 lg:flex-none">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="normal-case font-semibold w-full lg:w-auto"
            sx={{ 
                bgcolor: '#00244F', 
                '&:hover': { bgcolor: '#0D47A1' },
                height: '40px', 
                borderRadius: '6px' 
            }}
          >
            Create
          </Button>
        </Link>
        
        <Button
          variant="outlined"
          startIcon={<GetAppIcon />}
          className="normal-case font-semibold flex-1 lg:flex-none"
          sx={{
            color: 'var(--tw-colors-text-primary)',
            borderColor: '#D1D5DB',
            height: '40px', 
            borderRadius: '6px' 
          }}
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export default SpecialistFilter;
