import { Router, Response } from 'express';
import { CustomRequest } from '../types/Request';
import { UserRole } from '../models/User';
import { protect, authorize } from '../middlewares/auth.middleware';
import { upload } from '../config/multer.config';
import { 
  getAllSpecialists, 
  getSpecialistBySlug,
  deleteSpecialist, 
  publishSpecialist, 
  createOrUpdateSpecialistWithMedia,
  deleteMediaForSpecialist,
  updateMediaSlot
} from '../services/specialist.service';
import asyncHandler from '../middlewares/async.middleware';
import { ApiError } from '../middlewares/error.middleware'; // THIS LINE WAS MISSING

const specialistRouter = Router();

specialistRouter.use(protect, authorize(UserRole.ADMIN));

specialistRouter.get('/', asyncHandler(async (req: CustomRequest, res: Response) => {
  const { filter, search, page, limit } = req.query;
  const specialists = await getAllSpecialists(
    (filter as any) || 'All',
    (search as string) || '',
    parseInt((page as string) || '1', 10),
    parseInt((limit as string) || '10', 10)
  );
  res.status(200).json({ status: 'success', ...specialists });
}));

specialistRouter.get('/:slug', asyncHandler(async (req: CustomRequest, res: Response) => {
  const specialist = await getSpecialistBySlug(req.params.slug);
  res.status(200).json({ status: 'success', data: specialist });
}));

specialistRouter.post('/', upload.array('images', 5), asyncHandler(async (req: CustomRequest, res: Response) => {
  const data = req.body;
  const files = req.files as Express.Multer.File[];
  const specialist = await createOrUpdateSpecialistWithMedia(data, files, 'create'); 
  res.status(201).json({ status: 'success', data: specialist });
}));

specialistRouter.put('/:id', upload.array('images', 5), asyncHandler(async (req: CustomRequest, res: Response) => {
  const data = req.body;
  const files = req.files as Express.Multer.File[];
  const specialist = await createOrUpdateSpecialistWithMedia(data, files, 'update', req.params.id); 
  res.status(200).json({ status: 'success', data: specialist });
}));

specialistRouter.patch('/:id/publish', asyncHandler(async (req: CustomRequest, res: Response) => {
  const specialist = await publishSpecialist(req.params.id);
  res.status(200).json({ status: 'success', data: specialist });
}));

specialistRouter.delete('/:id', asyncHandler(async (req: CustomRequest, res: Response) => {
  await deleteSpecialist(req.params.id);
  res.status(204).send();
}));

specialistRouter.delete('/media/:mediaId', asyncHandler(async(req: CustomRequest, res: Response) => {
    await deleteMediaForSpecialist(req.params.mediaId);
    res.status(204).send();
}));

specialistRouter.put('/:id/media/:order', upload.single('image'), asyncHandler(async (req: CustomRequest, res: Response) => {
    const { id, order } = req.params;
    const file = req.file;

    if (!file) {
        throw new ApiError(400, 'Image file is required.');
    }

    const updatedMedia = await updateMediaSlot(id, parseInt(order, 10), file);
    res.status(200).json({ status: 'success', data: updatedMedia });
}));

export default specialistRouter;
