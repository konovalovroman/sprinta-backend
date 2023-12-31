import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEditedFieldToComments1702996065237 implements MigrationInterface {
    name = 'AddEditedFieldToComments1702996065237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "edited" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "edited"`);
    }

}
