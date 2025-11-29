// src/models/ServiceOffering.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BaseEntity, Index } from 'typeorm';
import { Specialist } from './Specialist';

@Entity('service_offerings')
@Index(['specialist_id', 'title'], { unique: true }) // Index for specialist + title uniqueness
export class ServiceOffering extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Foreign Key to specialists table
  @Column({ type: 'uuid' }) // Explicit column for the FK
  specialist_id!: string;

  @ManyToOne(() => Specialist, specialist => specialist.service_offerings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'specialist_id' })
  specialist!: Specialist;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number; // Price for this specific offering

  // Timestamps
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}