// src/routes/specialist.route.ts (FULL CORRECTED CODE with asyncHandler)

import { Router, Response } from 'express';
import { CustomRequest } from '../types/Request';
import { Specialist, VerificationStatus } from '../models/Specialist';
import { UserRole } from '../models/User';
import { protect, authorize } from '../middlewares/auth.middleware';
import { createSpecialist, getAllSpecialists, getSpecialistById, updateSpecialist, deleteSpecialist, publishSpecialist } from '../services/specialist.service';
import { ApiError } from '../middlewares/error.middleware';
import asyncHandler from '../middlewares/async.middleware'; // <-- NEW IMPORT

const specialistRouter = Router();

// Middleware to ensure only Admin users can manage specialists (Create, Update, Delete, Publish)
specialistRouter.use(protect, authorize(UserRole.ADMIN));

/**
 * @route GET /api/specialists
 * @description Get a list of specialists with filtering, searching, and pagination (Page 1).
 * @access Admin
 */
specialistRouter.get('/', asyncHandler(async (req: CustomRequest, res: Response) => { // <-- WRAPPED
    const { filter, search, page, limit } = req.query;

    const specialists = await getAllSpecialists(
        (filter as any) || 'All', // 'All' | 'Drafts' | 'Published'
        (search as string) || '',
        parseInt((page as string) || '1', 10),
        parseInt((limit as string) || '10', 10)
    );

    res.status(200).json({
        status: 'success',
        ...specialists,
    });
}));

/**
 * @route GET /api/specialists/:id
 * @description Get a single specialist by ID (used for Page 3: Editing).
 * @access Admin
 */
specialistRouter.get('/:id', asyncHandler(async (req: CustomRequest, res: Response) => { // <-- WRAPPED
    const specialist = await getSpecialistById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: specialist,
    });
}));

/**
 * @route POST /api/specialists
 * @description Create a new specialist (used for Page 2: Create Specialist).
 * @access Admin
 */
specialistRouter.post('/', asyncHandler(async (req: CustomRequest, res: Response) => { // <-- WRAPPED
    const data: Partial<Specialist> = req.body;
    
    // Minimal validation to ensure essential fields exist
    if (!data.title || !data.description || !data.base_price) {
        throw new ApiError(400, 'Title, description, and base price are required to create a specialist.');
    }

    const specialist = await createSpecialist(data);

    res.status(201).json({
        status: 'success',
        message: 'Specialist created successfully.',
        data: specialist,
    });
}));

/**
 * @route PUT /api/specialists/:id
 * @description Update an existing specialist (used for Page 3: Editing).
 * @access Admin
 */
specialistRouter.put('/:id', asyncHandler(async (req: CustomRequest, res: Response) => { // <-- WRAPPED
    const data: Partial<Specialist> = req.body;
    
    const specialist = await updateSpecialist(req.params.id, data);

    res.status(200).json({
        status: 'success',
        message: 'Specialist updated successfully.',
        data: specialist,
    });
}));

/**
 * @route PATCH /api/specialists/:id/publish
 * @description Publish a specialist (Final Flow).
 * @access Admin
 */
specialistRouter.patch('/:id/publish', asyncHandler(async (req: CustomRequest, res: Response) => { // <-- WRAPPED
    const specialist = await publishSpecialist(req.params.id);

    res.status(200).json({
        status: 'success',
        message: 'Specialist published successfully.',
        data: specialist,
    });
}));


/**
 * @route DELETE /api/specialists/:id
 * @description Soft delete a specialist.
 * @access Admin
 */
specialistRouter.delete('/:id', asyncHandler(async (req: CustomRequest, res: Response) => { // <-- WRAPPED
    await deleteSpecialist(req.params.id);

    res.status(204).send(); // 204 No Content for successful deletion
}));

export default specialistRouter;