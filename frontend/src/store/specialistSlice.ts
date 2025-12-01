import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Media {
    id: string;
    file_name: string;
    display_order: number;
}

export interface Specialist {
    id: string;
    title: string;
    description: string;
    base_price: number;
    platform_fee: number | null;
    final_price: number | null;
    duration_days: number;
    is_draft: boolean;
    verification_status: 'pending' | 'approved' | 'rejected';
    slug: string;
    media: Media[];
    purchases: number; 
}

interface SpecialistState {
    list: Specialist[];
    total: number;
    page: number;
    limit: number;
    filter: 'All' | 'Drafts' | 'Published';
    search: string;
    loading: boolean;
    error: string | null;
}

const initialState: SpecialistState = {
    list: [],
    total: 0,
    page: 1,
    limit: 10,
    filter: 'All', 
    search: '',
    loading: false,
    error: null,
};

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
            state.page = 1;
        },
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
            state.page = 1;
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