import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebpToEnum1709567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // This SQL adds 'image/webp' to the enum if it doesn't exist
        await queryRunner.query(`ALTER TYPE "public"."media_mime_type_enum" ADD VALUE IF NOT EXISTS 'image/webp'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Postgres doesn't support removing values from enums easily, so we usually leave it or drop/recreate
        // For safety, we'll leave it in down migration or just comment it out
    }
}
