// src/models/Media.ts (FINAL CORRECTED VERSION for Module 3)

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, BaseEntity, Index, JoinColumn } from 'typeorm';
import { Specialist } from './Specialist';

export enum MimeType {
  JPG = 'image/jpeg',
  PNG = 'image/png',
  MP4 = 'video/mp4',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

@Entity('media')
@Index(['specialist_id', 'file_name'], { unique: true }) // Added compound index for uniqueness check
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  
  // Foreign Key to specialists table
  @Column({ type: 'uuid' }) // Explicit column for the FK
  specialist_id!: string; 

  @ManyToOne(() => Specialist, specialist => specialist.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'specialist_id' }) // Join the column specialist_id with the specialist entity
  specialist!: Specialist; 

  // File Metadata
  @Column()
  file_name!: string;

  @Column({ type: 'int', nullable: true }) // <-- FIXED: Added type: 'int'
  file_size!: number | null; // Stored in bytes

  @Column({ type: 'int', nullable: true }) // <-- FIXED: Added type: 'int'
  display_order!: number | null;

  @Column({ type: 'enum', enum: MimeType, nullable: true })
  mime_type!: MimeType | null;

  @Column({ type: 'enum', enum: MediaType, nullable: true })
  media_type!: MediaType | null;
  
  // Timestamps
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'uploaded_at' })
  uploaded_at!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at!: Date | null;
}