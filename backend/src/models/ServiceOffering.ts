import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BaseEntity, Index } from 'typeorm';
import { Specialist } from './Specialist';

@Entity('service_offerings')
@Index(['specialist_id', 'title'], { unique: true })
export class ServiceOffering extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  specialist_id!: string;

  @ManyToOne(() => Specialist, specialist => specialist.service_offerings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'specialist_id' })
  specialist!: Specialist;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
