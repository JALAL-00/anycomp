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

const PLATFORM_FEE_RATE = 0.20; 

const createUniqueSlug = async (title: string, id?: string): Promise<string> => {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existingSpecialist = await specialistRepository.createQueryBuilder('specialist').where('specialist.slug = :slug', { slug }).andWhere(id ? 'specialist.id != :id' : '1=1', { id }).getOne();
    if (!existingSpecialist) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
};

export const createOrUpdateSpecialistWithMedia = async (data: any, files: Express.Multer.File[] | undefined, mode: 'create' | 'update', specialistId?: string): Promise<Specialist> => {
    const parsedData: DeepPartial<Specialist> = { title: data.title, description: data.description, base_price: data.base_price ? parseFloat(data.base_price) : 0, duration_days: data.duration_days ? parseInt(data.duration_days, 10) : 1 };
    if (parsedData.base_price) {
        const basePrice = parsedData.base_price;
        const platformFee = basePrice * PLATFORM_FEE_RATE;
        const finalPrice = basePrice + platformFee;
        parsedData.platform_fee = platformFee;
        parsedData.final_price = finalPrice;
    }
    return AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        let specialist: Specialist;
        if (mode === 'create') {
            parsedData.slug = await createUniqueSlug(parsedData.title!);
            specialist = transactionalEntityManager.create(Specialist, parsedData); 
        } else {
            const existing = await transactionalEntityManager.findOneBy(Specialist, { id: specialistId });
            if (!existing) { throw new ApiError(404, `Specialist with ID ${specialistId} not found.`); }
            if (parsedData.title && parsedData.title !== existing.title) { parsedData.slug = await createUniqueSlug(parsedData.title, specialistId); }
            specialist = transactionalEntityManager.merge(Specialist, existing, parsedData) as Specialist;
        }
        const savedSpecialist = await transactionalEntityManager.save(specialist); 
        if (files && files.length > 0) {
            const mediaEntities = files.map((file, index) => {
                // THIS IS THE CORRECTED LOGIC
                const relativePath = `/uploads/${file.filename}`;
                return transactionalEntityManager.create(Media, { file_name: relativePath, file_size: file.size, mime_type: file.mimetype as any, display_order: index + 1, specialist_id: savedSpecialist.id });
            });
            await transactionalEntityManager.save(mediaEntities);
        }
        return transactionalEntityManager.findOneOrFail(Specialist, { where: { id: savedSpecialist.id }, relations: ['media', 'service_offerings'], });
    });
};

export const getSpecialistById = async (id: string): Promise<Specialist> => {
  const specialist = await specialistRepository.findOne({ where: { id, deleted_at: null as any }, relations: ['media', 'service_offerings'] });
  if (!specialist) throw new ApiError(404, `Specialist with ID ${id} not found.`);
  return specialist;
};

export const getSpecialistBySlug = async (slug: string): Promise<Specialist> => {
  const specialist = await specialistRepository.findOne({ where: { slug, deleted_at: null as any }, relations: ['media', 'service_offerings'], });
  if (!specialist) { throw new ApiError(404, `Specialist with slug '${slug}' not found.`); }
  return specialist;
};

export const getAllSpecialists = async (filter: 'All' | 'Drafts' | 'Published' = 'All', search: string = '', page: number = 1, limit: number = 10): Promise<{ data: Specialist[], total: number, page: number, limit: number }> => {
  const query = specialistRepository.createQueryBuilder('specialist').leftJoinAndSelect('specialist.media', 'media').where('specialist.deleted_at IS NULL');
  if (filter === 'Drafts') { query.andWhere('specialist.is_draft = :is_draft', { is_draft: true }); } 
  else if (filter === 'Published') { query.andWhere('specialist.is_draft = :is_draft', { is_draft: false }); }
  if (search) { query.andWhere('(LOWER(specialist.title) LIKE LOWER(:search) OR LOWER(specialist.description) LIKE LOWER(:search))', { search: `%${search}%` }); }
  query.orderBy('specialist.created_at', 'DESC').skip((page - 1) * limit).take(limit);
  const [data, total] = await query.getManyAndCount();
  return { data, total, page, limit };
};

export const deleteSpecialist = async (id: string): Promise<void> => {
  const deleteResult = await specialistRepository.softDelete(id);
  if (deleteResult.affected === 0) throw new ApiError(404, `Specialist with ID ${id} not found.`);
};

export const deleteMediaForSpecialist = async (mediaId: string): Promise<void> => {
    const media = await mediaRepository.findOneBy({ id: mediaId });
    if (!media) { throw new ApiError(404, 'Media not found'); }
    try {
        const filename = path.basename(media.file_name);
        await fs.unlink(path.join(__dirname, '../../public/uploads', filename));
    } catch (err) { console.error('Failed to delete file from disk:', err); }
    await mediaRepository.delete(mediaId);
};

export const publishSpecialist = async (id: string): Promise<Specialist> => {
  const specialist = await specialistRepository.findOneBy({ id, deleted_at: null as any });
  if (!specialist) { throw new ApiError(404, `Specialist with ID ${id} not found.`); }
  specialist.is_draft = false;
  specialist.verification_status = VerificationStatus.APPROVED;
  return await specialistRepository.save(specialist);
};

export const updateMediaSlot = async (specialistId: string, displayOrder: number, file: Express.Multer.File): Promise<Media> => {
    const specialist = await specialistRepository.findOneBy({ id: specialistId });
    if (!specialist) { throw new ApiError(404, 'Specialist not found'); }
    let media = await mediaRepository.findOneBy({ specialist_id: specialistId, display_order: displayOrder });
    if (media && media.file_name) {
        try {
            const oldFilename = path.basename(media.file_name);
            await fs.unlink(path.join(__dirname, '../../public/uploads', oldFilename));
        } catch (err) { console.error("Old file not found, continuing...", err); }
    }
    // THIS IS THE CORRECTED LOGIC
    const relativePath = `/uploads/${file.filename}`;
    if (media) {
        media.file_name = relativePath;
        media.file_size = file.size;
        media.mime_type = file.mimetype as any;
    } else {
        media = mediaRepository.create({ specialist_id: specialistId, display_order: displayOrder, file_name: relativePath, file_size: file.size, mime_type: file.mimetype as any, });
    }
    return mediaRepository.save(media);
};