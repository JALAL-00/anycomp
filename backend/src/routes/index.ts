import { Router, Response } from 'express';
import { CustomRequest } from '../types/Request';
import { AppDataSource } from '../db/data-source';
import { protectedRoute } from '../middlewares/auth.middleware';

const router = Router();

router.get('/health', (req: CustomRequest, res: Response) => {
  const dbStatus = AppDataSource.isInitialized ? 'Connected' : 'Disconnected';
  const dbUp = AppDataSource.isInitialized;

  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    service: 'Anycomp Backend API',
    database: {
      type: AppDataSource.options.type,
      status: dbStatus,
      up: dbUp
    },
    timestamp: new Date().toISOString()
  });
});

router.use('/test', protectedRoute);

export default router;
