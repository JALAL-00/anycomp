// src/lib/dataFetcher.ts

import { AppDispatch } from '@/store/store';
import { setLoading, setError, setSpecialists } from '@/store/specialistSlice';
import api from './api';
import { Specialist } from '@/store/specialistSlice';

interface FetchParams {
    filter: 'All' | 'Drafts' | 'Published';
    search: string;
    page: number;
    limit: number;
}

/**
 * Thunk to fetch specialists data from the backend API.
 */
export const fetchSpecialists = ({ filter, search, page, limit }: FetchParams) => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const params = {
                filter,
                search,
                page,
                limit
            };
            
            const response = await api.get('/specialists', { params });
            const { data, total, page: fetchedPage, limit: fetchedLimit } = response.data;
            
            // NOTE: Backend returns raw data. We map it to add mocked fields 
            // like 'purchases' as per the Figma table columns, since the DB schema 
            // doesn't contain a dedicated 'purchases' column.
            const mockedData: Specialist[] = data.map((item: any) => ({
                ...item,
                // MOCK DATA for the table's "Purchases" column
                purchases: Math.floor(Math.random() * 500) + 10,
            }));

            dispatch(setSpecialists({ data: mockedData, total, page: fetchedPage, limit: fetchedLimit }));
        } catch (error) {
            console.error('Failed to fetch specialists:', error);
            // Use the uniform error handling message from the API client
            dispatch(setError(`Failed to load specialists data: ${error}`));
        }
    };
};