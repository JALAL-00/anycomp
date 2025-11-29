// src/db/migrations/1708892288123-CreateUserTable.ts
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1708892288123 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "gen_random_uuid()" // Use PostgreSQL function to generate UUID
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "password",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "role",
                    type: "enum",
                    enum: ['admin', 'specialist'],
                    default: "'specialist'",
                },
                {
                    name: "is_active",
                    type: "boolean",
                    default: true,
                },
                {
                    name: "created_at",
                    type: "timestamp with time zone",
                    default: "now()",
                },
                {
                    name: "updated_at",
                    type: "timestamp with time zone",
                    default: "now()",
                },
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}