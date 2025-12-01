import { AppDataSource } from '../db/data-source';
import { Specialist, VerificationStatus } from '../models/Specialist';
import { Media } from '../models/Media'; 
import { ApiError } from '../middlewares/error.middleware';
import { DeepPartial } from 'typeorm'; 
import slugify from 'slugify';
import fs from 'fs/promises';
import path from 'path';

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

export const createOrUpdateSpecialistWithMedia = async (
    data: any,
    files: Express.Multer.File[],
    mode: 'create' | 'update', 
    specialistId?: string
): Promise<Specialist> => {
    const parsedData: DeepPartial<Specialist> = {
        ...data,
        base_price: data.base_price ? parseFloat(data.base_price) : undefined,
        platform_fee: data.platform_fee ? parseFloat(data.platform_fee) : undefined,
        final_price: data.final_price ? parseFloat(data.final_price) : undefined,
        duration_days: data.duration_days ? parseInt(data.duration_days, 10) : undefined,
    };
    
    return AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        let specialist: Specialist;

        if (mode === 'create') {
            parsedData.slug = await createUniqueSlug(parsedData.title!);
            specialist = transactionalEntityManager.create(Specialist, parsedData); 
        } else {
            const existing = await transactionalEntityManager.findOneBy(Specialist, { id: specialistId });
            if (!existing) {
                throw new ApiError(404, `Specialist with ID ${specialistId} not found.`);
            }
            if (parsedData.title && parsedData.title !== existing.title) {
                parsedData.slug = await createUniqueSlug(parsedData.title, specialistId);
            }
            specialist = transactionalEntityManager.merge(Specialist, existing, parsedData);
        }

        const savedSpecialist = await transactionalEntityManager.save(specialist); 
        
        if (files && files.length > 0) {
            const mediaEntities = files.map((file, index) => {
                const serverUrl = `http://localhost:${process.env.PORT || 5002}/uploads/${file.filename}`;
                return transactionalEntityManager.create(Media, { 
                    file_name: serverUrl,
                    file_size: file.size,
                    mime_type: file.mimetype as any,
                    display_order: index + 1,
                    specialist_id: savedSpecialist.id 
                });
            });
            await transactionalEntityManager.save(mediaEntities);
        }
        
        // THIS IS THE CORRECTED LINE
        return transactionalEntityManager.findOneOrFail(Specialist, {
            where: { id: savedSpecialist.id },
            relations: ['media', 'service_offerings'],
        });
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

export const getSpecialistBySlug = async (slug: string): Promise<Specialist> => {
  const specialist = await specialistRepository.findOne({
    where: { slug, deleted_at: null as any },
    relations: ['media', 'service_offerings'],
  });

  if (!specialist) {
    throw new ApiError(404, `Specialist with slug '${slug}' not found.`);
  }
  return specialist;
};

export const getAllSpecialists = async (
  filter: 'All' | 'Drafts' | 'Published' = 'All',
  search: string = '',
  page: number = 1,
  limit: number = 10
): Promise<{ data: Specialist[], total: number, page: number, limit: number }> => {
  
  const query = specialistRepository.createQueryBuilder('specialist');
  query.where('specialist.deleted_at IS NULL');

  if (filter === 'Drafts') {
    query.andWhere('specialist.is_draft = :is_draft', { is_draft: true });
  } else if (filter === 'Published') {
    query.andWhere('specialist.is_draft = :is_draft', { is_draft: false });
  }

  if (search) {
      query.andWhere('(LOWER(specialist.title) LIKE LOWER(:search) OR LOWER(specialist.description) LIKE LOWER(:search))', { search: `%${search}%` });
  }

  query.orderBy('specialist.created_at', 'DESC')
     .skip((page - 1) * limit)
     .take(limit);

  const [data, total] = await query.getManyAndCount();
  return { data, total, page, limit };
};

export const deleteSpecialist = async (id: string): Promise<void> => {
  const deleteResult = await specialistRepository.softDelete(id);
  if (deleteResult.affected === 0) throw new ApiError(404, `Specialist with ID ${id} not found.`);
};

export const deleteMediaForSpecialist = async (mediaId: string): Promise<void> => {
    const media = await mediaRepository.findOneBy({ id: mediaId });
    if (!media) {
        throw new ApiError(404, 'Media not found');
    }

    try {
        const urlParts = media.file_name.split('/');
        const filename = urlParts[urlParts.length - 1];
        const filePath = path.join(__dirname, '../../public/uploads', filename);
        await fs.unlink(filePath);
    } catch (err) {
        console.error('Failed to delete file from disk:', err);
    }
    
    await mediaRepository.delete(mediaId);
};

export const publishSpecialist = async (id: string): Promise<Specialist> => {
  const specialist = await specialistRepository.findOneBy({ id, deleted_at: null as any });
  if (!specialist) throw new ApiError(404, `Specialist with ID ${id} not found.`);

  specialist.is_draft = false;
  specialist.verification_status = VerificationStatus.APPROVED;

  return await specialistRepository.save(specialist);
};