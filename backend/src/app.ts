// src/app.ts

import 'dotenv/config'; // Load environment variables first
import 'reflect-metadata'; // Required for TypeORM decorators
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Database and Middleware imports
import { initializeDatabase, AppDataSource } from './db/data-source';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Routes imports
import baseRouter from './routes/index'; 
import authRouter from './routes/auth.route'; // Import auth router
import { createAdminIfNotExist } from './services/auth.service'; // Import Admin creator


const app: Application = express();
const PORT = process.env.PORT || 5002;

// === 1. Essential Middlewares ===

// Security headers
app.use(helmet()); 

// CORS configuration (allow all for development, restrict in production)
const corsOptions = {
    origin: '*', // Allow all origins for now
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// JSON Body Parser
app.use(express.json()); 

// === 2. API Routes ===

// Base route for health check and general info
app.use('/api/auth', authRouter);
app.use('/api', baseRouter); 

// === 3. Error Handlers ===

// 404 Not Found Middleware (must be placed after all routes)
app.use(notFoundHandler); 

// Global Error Handler Middleware (must be placed last)
app.use(errorHandler);


/**
 * Main application initializer function.
 * Connects to the database and starts the Express server.
 */
const startServer = async () => {
    // Connect to PostgreSQL via TypeORM
    await initializeDatabase(); 
    
    // ADDED: Run migrations on server start (Development Mode ONLY)
    if (!AppDataSource.options.synchronize) {
      console.log("Running pending migrations...");
      await AppDataSource.runMigrations(); 
    }

    // Create a default Admin user if none exists
    await createAdminIfNotExist(); 

    // Start the Express server
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
};


startServer();