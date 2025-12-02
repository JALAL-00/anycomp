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
            
            const mockedData: Specialist[] = data.map((item: any) => ({
                ...item,
                purchases: Math.floor(Math.random() * 500) + 10,
            }));

            dispatch(setSpecialists({ data: mockedData, total, page: fetchedPage, limit: fetchedLimit }));
        } catch (error) {
            console.error('Failed to fetch specialists:', error);
            dispatch(setError(`Failed to load specialists data: ${error}`));
        }
    };
};