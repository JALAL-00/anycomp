// src/store/specialistSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// --- Type Definitions (Frontend Schema) ---

// Corresponds to the Specialist entity from the backend (simplified for the frontend)
export interface Specialist {
    id: string;
    title: string;
    description: string;
    base_price: number;
    platform_fee: number | null;
    final_price: number | null;
    duration_days: number;
    is_draft: boolean; // true=Draft, false=Published
    verification_status: 'pending' | 'approved' | 'rejected';
    // Mocked/Calculated fields for the table display:
    purchases: number; 
}

// State for the All Specialists page (Page 1 Requirements)
interface SpecialistState {
    list: Specialist[];
    total: number;
    page: number;
    limit: number;
    filter: 'All' | 'Drafts' | 'Published'; // Page 1 requirement
    search: string; // Page 1 requirement
    loading: boolean;
    error: string | null;
}

// Initial State (Defaulting to Page 1 view)
const initialState: SpecialistState = {
    list: [],
    total: 0,
    page: 1,
    limit: 10, // Page 1 requirement: pagination when rows >= 10
    filter: 'All', 
    search: '',
    loading: false,
    error: null,
};


// --- Slice Implementation ---

const specialistSlice = createSlice({
    name: 'specialist',
    initialState,
    reducers: {
        setSpecialists(state, action: PayloadAction<{ data: Specialist[], total: number, page: number, limit: number }>) {
            state.list = action.payload.data;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        setFilter(state, action: PayloadAction<'All' | 'Drafts' | 'Published'>) {
            state.filter = action.payload;
            state.page = 1; // Reset page on filter change
        },
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
            state.page = 1; // Reset page on search change
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        }
    },
});

export const { 
    setSpecialists, 
    setLoading, 
    setError, 
    setFilter, 
    setSearch, 
    setPage 
} = specialistSlice.actions;

export default specialistSlice.reducer;