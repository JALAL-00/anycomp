// src/services/specialist.service.ts


import { AppDataSource } from '../db/data-source';
import { Specialist, VerificationStatus } from '../models/Specialist';
import { ApiError } from '../middlewares/error.middleware';
import { FindManyOptions, QueryFailedError } from 'typeorm';
import slugify from 'slugify';

// Get repositories
const specialistRepository = AppDataSource.getRepository(Specialist);

// === Utility Functions ===

/**
 * Creates a URL-friendly slug from a title, ensuring uniqueness.
 */
const createUniqueSlug = async (title: string, id?: string): Promise<string> => {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existingSpecialist = await specialistRepository
            .createQueryBuilder('specialist')
            .where('specialist.slug = :slug', { slug })
            // Exclude the current specialist during an update operation
            .andWhere(id ? 'specialist.id != :id' : '1=1', { id }) 
            .getOne();

        if (!existingSpecialist) {
            return slug;
        }

        slug = `${baseSlug}-${counter++}`;
    }
};


// === CRUD Operations ===

/**
 * Creates a new Specialist record.
 */
export const createSpecialist = async (data: Partial<Specialist>): Promise<Specialist> => {
    // 1. Generate unique slug
    data.slug = await createUniqueSlug(data.title!);

    // 2. Create and Save
    try {
        const newSpecialist = specialistRepository.create(data);
        return await specialistRepository.save(newSpecialist);
    } catch (error) {
        if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
             throw new ApiError(409, 'A specialist with this title or slug already exists.');
        }
        throw error;
    }
};

/**
 * Retrieves a single specialist by ID.
 */
export const getSpecialistById = async (id: string): Promise<Specialist> => {
    const specialist = await specialistRepository.findOne({
        where: { id, deleted_at: null as any },
        relations: ['media', 'service_offerings'], // Eagerly load related data
    });

    if (!specialist) {
        throw new ApiError(404, `Specialist with ID ${id} not found.`);
    }
    return specialist;
};

/**
 * Retrieves all specialists with optional filtering, searching, and pagination (for Page 1: All Specialists).
 */
export const getAllSpecialists = async (
    filter: 'All' | 'Drafts' | 'Published' = 'All', 
    search: string = '', 
    page: number = 1, 
    limit: number = 10
): Promise<{ data: Specialist[], total: number, page: number, limit: number }> => {
    
    // 1. Build WHERE Clause
    const where: any = { deleted_at: null };
    
    // Apply Filter (Page 1 Requirement: "All", "Drafts", "Published")
    if (filter === 'Drafts') {
        where.is_draft = true;
    } else if (filter === 'Published') {
        // Acceptance Criteria: only published specialists (Not in Draft) should appear
        where.is_draft = false; 
    }
    // 'All' filter does nothing on is_draft, returning both

    // Apply Search (Case-insensitive search on title/description/slug)
    if (search) {
        // Uses TypeORM's query builder for OR logic
        const [data, total] = await specialistRepository
            .createQueryBuilder('specialist')
            .where(where) // Already includes is_draft filter logic
            .andWhere('(LOWER(specialist.title) LIKE LOWER(:search) OR LOWER(specialist.description) LIKE LOWER(:search) OR LOWER(specialist.slug) LIKE LOWER(:search))', { search: `%${search}%` })
            .offset((page - 1) * limit)
            .limit(limit)
            .orderBy('specialist.created_at', 'DESC')
            .getManyAndCount();

        return { data, total, page, limit };
    }


    // 2. If no complex search, use findAndCount for simple WHERE/Pagination
    const findOptions: FindManyOptions<Specialist> = {
        where: where,
        relations: ['media'], // Include media for card display
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
    };
    
    const [data, total] = await specialistRepository.findAndCount(findOptions);

    return { data, total, page, limit };
};

/**
 * Updates an existing specialist record.
 */
export const updateSpecialist = async (id: string, updateData: Partial<Specialist>): Promise<Specialist> => {
    const specialist = await specialistRepository.findOneBy({ id });

    if (!specialist) {
        throw new ApiError(404, `Specialist with ID ${id} not found for update.`);
    }

    // If title is being updated, generate a new unique slug
    if (updateData.title && updateData.title !== specialist.title) {
        updateData.slug = await createUniqueSlug(updateData.title, id);
    }
    
    // Merge existing specialist with new data
    specialistRepository.merge(specialist, updateData);
    
    return await specialistRepository.save(specialist);
};

/**
 * Soft deletes a specialist (sets deleted_at timestamp).
 */
export const deleteSpecialist = async (id: string): Promise<void> => {
    const deleteResult = await specialistRepository.softDelete(id);

    if (deleteResult.affected === 0) {
        throw new ApiError(404, `Specialist with ID ${id} not found for deletion.`);
    }
};

/**
 * Handles the publishing action (Final Flow).
 * Sets is_draft to false.
 */
export const publishSpecialist = async (id: string): Promise<Specialist> => {
    const specialist = await specialistRepository.findOneBy({ id, deleted_at: null as any });

    if (!specialist) {
        throw new ApiError(404, `Specialist with ID ${id} not found.`);
    }

    specialist.is_draft = false;
    specialist.verification_status = VerificationStatus.APPROVED; // Optional: Assume publish means approved
    
    return await specialistRepository.save(specialist);
}