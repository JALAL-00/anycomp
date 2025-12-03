import { AppDataSource } from '../db/data-source';
import { Specialist } from '../models/Specialist';

const specialistRepository = AppDataSource.getRepository(Specialist);

export const getPublishedSpecialists = async (): Promise<Specialist[]> => {
    const specialists = await specialistRepository.find({
        where: {
            is_draft: false, 
            deleted_at: null as any,
        },
        relations: ['media'], 
        order: {
            created_at: 'DESC',
        },
    });

    return specialists;
};