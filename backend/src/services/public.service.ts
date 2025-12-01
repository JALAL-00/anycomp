import { AppDataSource } from '../db/data-source';
import { Specialist } from '../models/Specialist';

const specialistRepository = AppDataSource.getRepository(Specialist);

export const getPublishedSpecialists = async (): Promise<Specialist[]> => {
    const specialists = await specialistRepository.find({
        where: {
            is_draft: false, // Only fetch records that are NOT drafts
            deleted_at: null as any,
        },
        relations: ['media'], // Eager load the media (images)
        order: {
            created_at: 'DESC',
        },
    });

    return specialists;
};