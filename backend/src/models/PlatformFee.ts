import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, Index } from 'typeorm';

export enum TierName {
  BASIC = 'Basic',
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
}

@Entity('platform_fee')
@Index(['tier_name'], { unique: true })
export class PlatformFee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: TierName, unique: true })
  tier_name!: TierName;

  @Column({ type: 'int' })
  min_value!: number;

  @Column({ type: 'int' })
  max_value!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  platform_fee_percentage!: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
