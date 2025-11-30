import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, DeleteDateColumn, BaseEntity } from 'typeorm';
import { Media } from './Media';
import { ServiceOffering } from './ServiceOffering';

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('specialists')
export class Specialist extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true, default: 0.00 })
  average_rating!: number | null;

  @Column({ type: 'int', default: 0 })
  total_number_of_ratings!: number;

  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
  verification_status!: VerificationStatus;

  @Column({ default: false })
  is_verified!: boolean;

  @Column({ default: true })
  is_draft!: boolean;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  base_price!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  platform_fee!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  final_price!: number | null;

  @Column({ type: 'int', nullable: true })
  duration_days!: number | null;

  @OneToMany(() => Media, media => media.specialist)
  media!: Media[];

  @OneToMany(() => ServiceOffering, serviceOffering => serviceOffering.specialist)
  service_offerings!: ServiceOffering[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at!: Date | null;
}
