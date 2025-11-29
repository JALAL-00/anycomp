// src/models/PlatformFee.ts (FINAL CORRECTED VERSION for Module 3)

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, Index } from 'typeorm';

export enum TierName {
  BASIC = 'Basic',
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
}

@Entity('platform_fee')
@Index(['tier_name'], { unique: true }) // Ensure tier names are unique
export class PlatformFee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: TierName, unique: true })
  tier_name!: TierName;

  @Column({ type: 'int' }) // <-- FIXED: Added type: 'int'
  min_value!: number; // Minimum price range for this tier

  @Column({ type: 'int' }) // <-- FIXED: Added type: 'int'
  max_value!: number; // Maximum price range for this tier

  @Column({ type: 'decimal', precision: 5, scale: 2 }) // This was correct
  platform_fee_percentage!: number; // e.g., 0.05 for 5%

  // Timestamps
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}