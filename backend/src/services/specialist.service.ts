import { AppDataSource } from '../db/data-source';
import { Specialist, VerificationStatus } from '../models/Specialist';
import { Media } from '../models/Media'; 
import { ApiError } from '../middlewares/error.middleware';
import { FindManyOptions, QueryFailedError, DeepPartial } from 'typeorm'; 
import slugify from 'slugify';

const specialistRepository = AppDataSource.getRepository(Specialist);
const mediaRepository = AppDataSource.getRepository(Media); 

const createUniqueSlug = async (title: string, id?: string): Promise<string> => {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingSpecialist = await specialistRepository
      .createQueryBuilder('specialist')
      .where('specialist.slug = :slug', { slug })
      .andWhere(id ? 'specialist.id != :id' : '1=1', { id })
      .getOne();

    if (!existingSpecialist) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
};

/**
 * Handles specialist creation/update with nested media and service offerings.
 * It is marked for internal use, replacing the old createSpecialist/updateSpecialist.
 */
export const createOrUpdateSpecialistWithMedia = async (
    data: DeepPartial<Specialist> & { media?: DeepPartial<Media>[] },
    mode: 'create' | 'update', 
    specialistId?: string
): Promise<Specialist> => {
    // Start a transaction for integrity
    return AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        
        let specialist: Specialist;
        let savedSpecialist: Specialist;

        // 1. HANDLE SPECIALIST ENTITY
        if (mode === 'create') {
            data.slug = await createUniqueSlug(data.title!);
            // Ensure data is treated as the correct type after creation
            specialist = transactionalEntityManager.create(Specialist, data) as Specialist; 
        } else {
            const existing = await transactionalEntityManager.findOneBy(Specialist, { id: specialistId });
            if (!existing) {
                throw new ApiError(404, `Specialist with ID ${specialistId} not found.`);
            }
            if (data.title && data.title !== existing.title) {
                data.slug = await createUniqueSlug(data.title, specialistId);
            }
            // Ensure data is treated as the correct type after merging
            specialist = transactionalEntityManager.merge(Specialist, existing, data) as Specialist;
        }

        // SAVE SPECIALIST - Returns the fully saved entity with guaranteed ID
        savedSpecialist = await transactionalEntityManager.save(Specialist, specialist); 
        
        // 2. HANDLE MEDIA ENTITIES (Delete old media and create new ones)
        if (specialistId) {
            await transactionalEntityManager.delete(Media, { specialist_id: specialistId }); 
        }
        
        if (data.media && data.media.length > 0) {
            const mediaEntities = data.media.map(mediaData => 
                transactionalEntityManager.create(Media, { 
                    ...mediaData, 
                    specialist_id: savedSpecialist.id 
                })
            );
            await transactionalEntityManager.save(Media, mediaEntities); 
        }
        
        // 3. RETURN FINAL ENTITY with its relations (Guaranteed ID is used)
        return transactionalEntityManager.findOne(Specialist, {
            where: { id: savedSpecialist.id },
            relations: ['media', 'service_offerings'],
        }) as Promise<Specialist>;
    });
};

export const getSpecialistById = async (id: string): Promise<Specialist> => {
  const specialist = await specialistRepository.findOne({
    where: { id, deleted_at: null as any },
    relations: ['media', 'service_offerings']
  });

  if (!specialist) throw new ApiError(404, `Specialist with ID ${id} not found.`);
  return specialist;
};

export const getAllSpecialists = async (
  filter: 'All' | 'Drafts' | 'Published' = 'All',
  search: string = '',
  page: number = 1,
  limit: number = 10
): Promise<{ data: Specialist[], total: number, page: number, limit: number }> => {
  const where: any = { deleted_at: null };

  if (filter === 'Drafts') where.is_draft = true;
  else if (filter === 'Published') where.is_draft = false;

  if (search) {
    const [data, total] = await specialistRepository
      .createQueryBuilder('specialist')
      .where(where)
      .andWhere('(LOWER(specialist.title) LIKE LOWER(:search) OR LOWER(specialist.description) LIKE LOWER(:search) OR LOWER(specialist.slug) LIKE LOWER(:search))', { search: `%${search}%` })
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy('specialist.created_at', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  const findOptions: FindManyOptions<Specialist> = {
    where,
    relations: ['media'],
    order: { created_at: 'DESC' },
    skip: (page - 1) * limit,
    take: limit
  };

  const [data, total] = await specialistRepository.findAndCount(findOptions);
  return { data, total, page, limit };
};

export const deleteSpecialist = async (id: string): Promise<void> => {
  const deleteResult = await specialistRepository.softDelete(id);
  if (deleteResult.affected === 0) throw new ApiError(404, `Specialist with ID ${id} not found for deletion.`);
};

export const publishSpecialist = async (id: string): Promise<Specialist> => {
  const specialist = await specialistRepository.findOneBy({ id, deleted_at: null as any });
  if (!specialist) throw new ApiError(404, `Specialist with ID ${id} not found.`);

  specialist.is_draft = false;
  specialist.verification_status = VerificationStatus.APPROVED;

  return await specialistRepository.save(specialist);
};