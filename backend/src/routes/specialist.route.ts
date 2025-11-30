import { Router, Response } from 'express';
import { CustomRequest } from '../types/Request';
import { Specialist } from '../models/Specialist';
import { UserRole } from '../models/User';
import { protect, authorize } from '../middlewares/auth.middleware';
import { getAllSpecialists, getSpecialistById, deleteSpecialist, publishSpecialist, createOrUpdateSpecialistWithMedia } from '../services/specialist.service'; // UPDATED IMPORTS
import { ApiError } from '../middlewares/error.middleware';
import asyncHandler from '../middlewares/async.middleware';

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

  res.status(200).json({
    status: 'success',
    ...specialists
  });
}));

specialistRouter.get('/:id', asyncHandler(async (req: CustomRequest, res: Response) => {
  const specialist = await getSpecialistById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: specialist
  });
}));

/**
 * @route POST /api/specialists - Handles Creation with Media Metadata
 */
specialistRouter.post('/', asyncHandler(async (req: CustomRequest, res: Response) => {
  const data: Partial<Specialist> = req.body;
    
  if (!data.title || !data.description || !data.base_price) {
    throw new ApiError(400, 'Title, description, and base price are required to create a specialist.');
  }

  // Use the new service function that handles nested media
  const specialist = await createOrUpdateSpecialistWithMedia(data, 'create'); 

  res.status(201).json({
    status: 'success',
    message: 'Specialist created successfully.',
    data: specialist
  });
}));

/**
 * @route PUT /api/specialists/:id - Handles Update with Media Metadata
 */
specialistRouter.put('/:id', asyncHandler(async (req: CustomRequest, res: Response) => {
  const data: Partial<Specialist> = req.body;
  
  // Use the new service function that handles nested media
  const specialist = await createOrUpdateSpecialistWithMedia(data, 'update', req.params.id); 

  res.status(200).json({
    status: 'success',
    message: 'Specialist updated successfully.',
    data: specialist
  });
}));

specialistRouter.patch('/:id/publish', asyncHandler(async (req: CustomRequest, res: Response) => {
  const specialist = await publishSpecialist(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Specialist published successfully.',
    data: specialist
  });
}));

specialistRouter.delete('/:id', asyncHandler(async (req: CustomRequest, res: Response) => {
  await deleteSpecialist(req.params.id);

  res.status(204).send();
}));

export default specialistRouter;
