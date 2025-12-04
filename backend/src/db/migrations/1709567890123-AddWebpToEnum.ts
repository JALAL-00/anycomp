import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebpToEnum1709567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."media_mime_type_enum" ADD VALUE IF NOT EXISTS 'image/webp'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
