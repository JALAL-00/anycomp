import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, BaseEntity, Index, JoinColumn } from 'typeorm';
import { Specialist } from './Specialist';

export enum MimeType {
  JPG = 'image/jpeg',
  PNG = 'image/png',
  MP4 = 'video/mp4',
  WEBP = 'image/webp',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

@Entity('media')
@Index(['specialist_id', 'file_name'], { unique: true })
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  specialist_id!: string;

  @ManyToOne(() => Specialist, specialist => specialist.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'specialist_id' })
  specialist!: Specialist;

  @Column()
  file_name!: string;

  @Column({ type: 'int', nullable: true })
  file_size!: number | null;

  @Column({ type: 'int', nullable: true })
  display_order!: number | null;

  @Column({ type: 'enum', enum: MimeType, nullable: true })
  mime_type!: MimeType | null;

  @Column({ type: 'enum', enum: MediaType, nullable: true })
  media_type!: MediaType | null;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'uploaded_at' })
  uploaded_at!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at!: Date | null;
}
