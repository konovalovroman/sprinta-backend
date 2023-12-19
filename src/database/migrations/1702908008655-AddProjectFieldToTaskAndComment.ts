import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectFieldToTaskAndComment1702908008655 implements MigrationInterface {
    name = 'AddProjectFieldToTaskAndComment1702908008655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "project_id" integer`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "project_id" integer`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_03dbde2ff570596e874bb3bb311" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_03dbde2ff570596e874bb3bb311"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "project_id"`);
    }

}
