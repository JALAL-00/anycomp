// src/models/Specialist.ts (FINAL CORRECTED VERSION for Module 3)

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, DeleteDateColumn, BaseEntity } from 'typeorm';
import { Media } from './Media';
import { ServiceOffering } from './ServiceOffering';

// Enum definitions based on the provided schema
export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('specialists')
export class Specialist extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Rating and Verification
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true, default: 0.00 })
  average_rating!: number | null;

  @Column({ type: 'int', default: 0 }) // Added type: 'int'
  total_number_of_ratings!: number;

  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
  verification_status!: VerificationStatus;

  @Column({ default: false })
  is_verified!: boolean;

  // Status (Draft/Published)
  @Column({ default: true })
  is_draft!: boolean; // true = Draft, false = Published

  // Content Fields
  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text' })
  description!: string;

  // Pricing
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  base_price!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  platform_fee!: number | null; // The absolute fee amount

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  final_price!: number | null;

  // Duration
  @Column({ type: 'int', nullable: true }) // <-- FINAL FIX: Added type: 'int'
  duration_days!: number | null;

  // Relationships (Foreign Key connections based on schema)
  @OneToMany(() => Media, media => media.specialist)
  media!: Media[]; // Corresponds to the 'specialists' column in the media table

  @OneToMany(() => ServiceOffering, serviceOffering => serviceOffering.specialist)
  service_offerings!: ServiceOffering[]; // Corresponds to the 'specialists' column in the service_offerings table

  // Timestamps
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at!: Date | null;
}