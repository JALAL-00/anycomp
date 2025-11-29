// src/components/specialists/SpecialistFilter.tsx (FINAL PIXEL-PERFECT UPDATE)
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

// Define the tabs based on the Page 1 requirement
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
    <div className="flex justify-between items-start mb-6">
      
      {/* LEFT SIDE: Filter Tabs (Top) and Search Bar (Bottom) */}
      <div className="flex flex-col space-y-4"> {/* Use flex-col for vertical layout */}
        
        {/* 1. Filter Tabs (All, Drafts, Published) */}
        <div className="flex space-x-2 border-b border-zinc-200">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => dispatch(setFilter(tab))}
              className={`pb-2 px-3 text-sm font-semibold transition-colors duration-150 ${
                currentFilter === tab
                  ? 'text-primary-blue border-b-2 border-primary-blue'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 2. Search Bar (Wider, Below Tabs, Light Gray BG) */}
        {/* Figma shows an input field with a search icon and 'Search Services' text */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search Services" // Figma shows placeholder
          value={localSearch}
          onChange={handleSearchChange}
          className='w-80' // Make it wider to match the Figma visual
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className='text-zinc-400' />
              </InputAdornment>
            ),
            // Custom styling for height, background color, and border
            style: { 
                borderRadius: '6px', 
                backgroundColor: '#F4F4F4', // Light Gray BG to match Figma
                height: '40px',
                paddingLeft: '0px',
                border: '1px solid transparent' // Remove default border
            }
          }}
          sx={{
            // Remove the MUI-specific default fieldset/border styling 
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: 'transparent', // Make default border transparent
                },
                '&:hover fieldset': {
                    borderColor: 'transparent', // Maintain transparent on hover
                },
                '&.Mui-focused fieldset': {
                    borderColor: 'transparent', // Maintain transparent on focus
                    boxShadow: '0 0 0 1px #0A66C2', // Add a subtle blue focus ring if needed
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

      {/* RIGHT SIDE: Buttons (Create & Export) */}
      <div className="flex space-x-3 mt-0"> {/* mt-0 to keep it aligned to the top */}
        {/* Create Button (Figma uses the Dark Navy color) */}
        <Link href="/admin/specialists/create" passHref>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="normal-case font-semibold"
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
        
        {/* Export Button (Figma uses subtle border/color) */}
        <Button
          variant="outlined"
          startIcon={<GetAppIcon />}
          className="normal-case font-semibold"
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