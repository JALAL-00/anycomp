import { Router, Response } from 'express';
import { CustomRequest } from '../types/Request';
import asyncHandler from '../middlewares/async.middleware';
import { getPublishedSpecialists } from '../services/public.service';

const publicRouter = Router();

publicRouter.get('/specialists', asyncHandler(async (req: CustomRequest, res: Response) => {
    const specialists = await getPublishedSpecialists();
    res.status(200).json({ status: 'success', data: specialists });
}));

export default publicRouter;