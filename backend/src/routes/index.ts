// src/routes/index.ts

import { Router, Response } from 'express'; // Removed Request
import { CustomRequest } from '../types/Request'; // <-- NEW IMPORT
import { AppDataSource } from '../db/data-source';
import { protectedRoute } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route GET /api/health
 * @description Checks the API server and database connection status.
 * @access Public
 */
router.get('/health', (req: CustomRequest, res: Response) => { // <-- Used CustomRequest
  const dbStatus = AppDataSource.isInitialized ? 'Connected' : 'Disconnected';
  const dbUp = AppDataSource.isInitialized;

  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    service: 'Anycomp Backend API',
    database: {
        type: AppDataSource.options.type,
        status: dbStatus,
        up: dbUp,
    },
    timestamp: new Date().toISOString(),
  });
});

router.use('/test', protectedRoute);

export default router;