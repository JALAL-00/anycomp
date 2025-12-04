// src/config/db.config.ts

import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Specialist } from '../models/Specialist';
import { Media } from '../models/Media';
import { PlatformFee } from '../models/PlatformFee';
import { ServiceOffering } from '../models/ServiceOffering';

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env;

if (!DB_HOST || !DB_PORT || !DB_USERNAME || !DB_PASSWORD || !DB_DATABASE) {
  console.error("Missing critical database environment variables. Check your .env file.");
  process.exit(1);
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: NODE_ENV === 'development',
  logging: NODE_ENV === 'development' ? ['error', 'warn', 'query'] : false,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  entities: [
    User,
    Specialist,
    Media,
    PlatformFee,
    ServiceOffering,
    NODE_ENV === 'production' 
      ? `${__dirname}/../models/*.js`
      : `${__dirname}/../models/*.ts`
  ],
  migrations: [
    NODE_ENV === 'production'
      ? `${__dirname}/../db/migrations/*.js`
      : `${__dirname}/../db/migrations/*.ts`
  ],
  subscribers: []
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("PostgreSQL Data Source has been initialized successfully.");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }
};
