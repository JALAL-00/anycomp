// src/models/User.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BaseEntity } from 'typeorm';
import { IsEmail, MinLength, MaxLength } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config/constants';

// Define the roles enum
export enum UserRole {
  ADMIN = 'admin',
  SPECIALIST = 'specialist',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  @MinLength(8)
  password!: string; // Stored as hashed

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SPECIALIST,
  })
  role!: UserRole;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // --- TypeORM Hooks ---

  /**
   * Hashes the password before the User entity is inserted into the database.
   */
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }

  /**
   * Compares a plain text password with the stored hashed password.
   */
  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}