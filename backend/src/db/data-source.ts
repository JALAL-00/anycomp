// src/config/db.config.ts

import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Specialist } from '../models/Specialist';
import { Media } from '../models/Media';
import { PlatformFee } from '../models/PlatformFee';
import { ServiceOffering } from '../models/ServiceOffering';

// Environment variables are loaded from .env file
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env;

if (!DB_HOST || !DB_PORT || !DB_USERNAME || !DB_PASSWORD || !DB_DATABASE) {
  console.error("Missing critical database environment variables. Check your .env file.");
  process.exit(1);
}

// TypeORM DataSource
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: NODE_ENV === 'development', // Set to false in production
  logging: NODE_ENV === 'development' ? ['error', 'warn', 'query'] : false,
  entities: [
    // Entities will be added here in Module 3
    User,
    Specialist,
    Media,
    PlatformFee,
    ServiceOffering,
    `${__dirname}/../models/*.ts`, 
  ],
  migrations: [
    // Migrations will be added here in Module 2/3
    `${__dirname}/../db/migrations/*.ts`,
  ],
  subscribers: [],
});

/**
 * Initializes the database connection.
 */
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("PostgreSQL Data Source has been initialized successfully.");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    // Exit application if DB connection fails
    process.exit(1);
  }
};