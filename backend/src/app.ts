import 'dotenv/config';
import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { initializeDatabase, AppDataSource } from './db/data-source';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import baseRouter from './routes/index';
import authRouter from './routes/auth.route';
import specialistRouter from './routes/specialist.route';
import { createAdminIfNotExist } from './services/auth.service';

const app: Application = express();
const PORT = process.env.PORT || 5002;

// CRITICAL FIX: Configure Helmet to allow cross-origin resource loading.
// This tells browsers that it's okay for the frontend to display images from this server.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());

// This serves the images from the /uploads folder. It will now have the correct headers from Helmet.
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/auth', authRouter);
app.use('/api/specialists', specialistRouter);
app.use('/api', baseRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await initializeDatabase();

  if (!AppDataSource.options.synchronize) {
    console.log("Running pending migrations...");
    await AppDataSource.runMigrations();
  }

  await createAdminIfNotExist();

  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(` API Base URL: http://localhost:${PORT}/api`);
    console.log(` Serving static files from: http://localhost:${PORT}/uploads`);
  });
};

startServer();
