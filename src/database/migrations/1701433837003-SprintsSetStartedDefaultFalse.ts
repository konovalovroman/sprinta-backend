import { MigrationInterface, QueryRunner } from "typeorm";

export class SprintsSetStartedDefaultFalse1701433837003 implements MigrationInterface {
    name = 'SprintsSetStartedDefaultFalse1701433837003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sprints" ALTER COLUMN "started" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sprints" ALTER COLUMN "started" DROP DEFAULT`);
    }

}
