// src/db/migrations/1708978600000-CreateSpecialistTables.ts

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

// Enums from models need to be defined in PostgreSQL
const VerificationStatusEnum = `'pending', 'approved', 'rejected'`;
const MimeTypeEnum = `'image/jpeg', 'image/png', 'video/mp4'`;
const MediaTypeEnum = `'image', 'video', 'document'`;
const TierNameEnum = `'Basic', 'Standard', 'Premium'`;

export class CreateSpecialistTables1708978600000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create Specialists Table
        await queryRunner.createTable(new Table({
            name: "specialists",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, default: "gen_random_uuid()" },
                { name: "average_rating", type: "decimal", precision: 3, scale: 2, isNullable: true, default: '0.00' },
                { name: "total_number_of_ratings", type: "int", default: 0 },
                { name: "is_draft", type: "boolean", default: true },
                { name: "title", type: "varchar", isNullable: false },
                { name: "slug", type: "varchar", isUnique: true, isNullable: false }, // Added UNIQUE constraint
                { name: "description", type: "text", isNullable: false },
                { name: "base_price", type: "decimal", precision: 10, scale: 2, isNullable: true },
                { name: "platform_fee", type: "decimal", precision: 10, scale: 2, isNullable: true },
                { name: "final_price", type: "decimal", precision: 10, scale: 2, isNullable: true },
                { name: "verification_status", type: "enum", enum: ['pending', 'approved', 'rejected'], default: `'pending'` },
                { name: "is_verified", type: "boolean", default: false },
                { name: "duration_days", type: "int", isNullable: true },
                { name: "created_at", type: "timestamp with time zone", default: "now()" },
                { name: "updated_at", type: "timestamp with time zone", default: "now()" },
                { name: "deleted_at", type: "timestamp with time zone", isNullable: true },
            ],
        }), true);

        // 2. Create Media Table
        await queryRunner.createTable(new Table({
            name: "media",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, default: "gen_random_uuid()" },
                { name: "specialist_id", type: "uuid", isNullable: false }, // Foreign Key
                { name: "file_name", type: "varchar", isNullable: false },
                { name: "file_size", type: "int", isNullable: true },
                { name: "display_order", type: "int", isNullable: true },
                { name: "mime_type", type: "enum", enum: ['image/jpeg', 'image/png', 'video/mp4'], isNullable: true },
                { name: "media_type", type: "enum", enum: ['image', 'video', 'document'], isNullable: true },
                { name: "uploaded_at", type: "timestamp with time zone", default: "now()" },
                { name: "deleted_at", type: "timestamp with time zone", isNullable: true },
            ],
        }), true);

        // Add Foreign Key and Index for Media
        await queryRunner.createForeignKey("media", new TableForeignKey({
            columnNames: ["specialist_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "specialists",
            onDelete: "CASCADE", // Delete media if specialist is deleted
        }));
        await queryRunner.createIndex("media", new TableIndex({
            name: "IDX_MEDIA_SPECIALIST_FILENAME_UNIQUE",
            columnNames: ["specialist_id", "file_name"],
            isUnique: true,
        }));


        // 3. Create Platform Fee Table
        await queryRunner.createTable(new Table({
            name: "platform_fee",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, default: "gen_random_uuid()" },
                { name: "tier_name", type: "enum", enum: ['Basic', 'Standard', 'Premium'], isUnique: true, isNullable: false },
                { name: "min_value", type: "int", isNullable: false },
                { name: "max_value", type: "int", isNullable: false },
                { name: "platform_fee_percentage", type: "decimal", precision: 5, scale: 2, isNullable: false },
                { name: "created_at", type: "timestamp with time zone", default: "now()" },
                { name: "updated_at", type: "timestamp with time zone", default: "now()" },
            ],
        }), true);

        // 4. Create Service Offerings Table
        await queryRunner.createTable(new Table({
            name: "service_offerings",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, default: "gen_random_uuid()" },
                { name: "specialist_id", type: "uuid", isNullable: false }, // Foreign Key
                { name: "title", type: "varchar", isNullable: false },
                { name: "description", type: "text", isNullable: true },
                { name: "price", type: "decimal", precision: 10, scale: 2, isNullable: false },
                { name: "created_at", type: "timestamp with time zone", default: "now()" },
                { name: "updated_at", type: "timestamp with time zone", default: "now()" },
            ],
        }), true);

        // Add Foreign Key and Index for Service Offerings
        await queryRunner.createForeignKey("service_offerings", new TableForeignKey({
            columnNames: ["specialist_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "specialists",
            onDelete: "CASCADE",
        }));
        await queryRunner.createIndex("service_offerings", new TableIndex({
            name: "IDX_SERVICE_SPECIALIST_TITLE_UNIQUE",
            columnNames: ["specialist_id", "title"],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("service_offerings");
        await queryRunner.dropTable("platform_fee");
        await queryRunner.dropTable("media");
        await queryRunner.dropTable("specialists");
        // Note: TypeORM doesn't automatically drop Enums, but we ignore for simplicity
    }
}