import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedEditedFieldFromComments1702996382470 implements MigrationInterface {
    name = 'RemovedEditedFieldFromComments1702996382470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "edited"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "edited" boolean NOT NULL DEFAULT false`);
    }

}
