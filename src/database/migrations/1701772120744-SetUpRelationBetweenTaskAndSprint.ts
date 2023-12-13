import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUpRelationBetweenTaskAndSprint1701772120744 implements MigrationInterface {
    name = 'SetUpRelationBetweenTaskAndSprint1701772120744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`);
        await queryRunner.query(`ALTER TABLE "tasks" RENAME COLUMN "project_id" TO "sprint_id"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_b512d5a489d692f66569978b8a7" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_b512d5a489d692f66569978b8a7"`);
        await queryRunner.query(`ALTER TABLE "tasks" RENAME COLUMN "sprint_id" TO "project_id"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
