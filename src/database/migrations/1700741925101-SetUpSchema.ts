import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetUpSchema1700741925101 implements MigrationInterface {
    name = 'SetUpSchema1700741925101';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(30) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(100) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "projects" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "owner_id" integer, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TYPE "public"."tasks_status_enum" AS ENUM(\'backlog\', \'to_do\', \'in_progress\', \'to_verify\', \'done\')');
        await queryRunner.query('CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text NOT NULL, "status" "public"."tasks_status_enum" NOT NULL, "estimation" smallint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "author_id" integer, "project_id" integer, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "comments" ("id" SERIAL NOT NULL, "text" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "author_id" integer, "task_id" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "sprints" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "started" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "project_id" integer, CONSTRAINT "PK_6800aa2e0f508561812c4b9afb4" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "users_and_projects" ("projectsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_38aebbf414f6b23d18996db606c" PRIMARY KEY ("projectsId", "usersId"))');
        await queryRunner.query('CREATE INDEX "IDX_df44729e08fd30342df4e3fc9d" ON "users_and_projects" ("projectsId") ');
        await queryRunner.query('CREATE INDEX "IDX_1a2a0e662671b2b7c7fa91f69e" ON "users_and_projects" ("usersId") ');
        await queryRunner.query('ALTER TABLE "projects" ADD CONSTRAINT "FK_b1bd2fbf5d0ef67319c91acb5cf" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "tasks" ADD CONSTRAINT "FK_42434f901d86bd2fc5f0f6e4779" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "comments" ADD CONSTRAINT "FK_e6d38899c31997c45d128a8973b" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "comments" ADD CONSTRAINT "FK_18c2493067c11f44efb35ca0e03" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "sprints" ADD CONSTRAINT "FK_82145010051f3f2fc94671c0b35" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "users_and_projects" ADD CONSTRAINT "FK_df44729e08fd30342df4e3fc9d8" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE "users_and_projects" ADD CONSTRAINT "FK_1a2a0e662671b2b7c7fa91f69e6" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "users_and_projects" DROP CONSTRAINT "FK_1a2a0e662671b2b7c7fa91f69e6"');
        await queryRunner.query('ALTER TABLE "users_and_projects" DROP CONSTRAINT "FK_df44729e08fd30342df4e3fc9d8"');
        await queryRunner.query('ALTER TABLE "sprints" DROP CONSTRAINT "FK_82145010051f3f2fc94671c0b35"');
        await queryRunner.query('ALTER TABLE "comments" DROP CONSTRAINT "FK_18c2493067c11f44efb35ca0e03"');
        await queryRunner.query('ALTER TABLE "comments" DROP CONSTRAINT "FK_e6d38899c31997c45d128a8973b"');
        await queryRunner.query('ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"');
        await queryRunner.query('ALTER TABLE "tasks" DROP CONSTRAINT "FK_42434f901d86bd2fc5f0f6e4779"');
        await queryRunner.query('ALTER TABLE "projects" DROP CONSTRAINT "FK_b1bd2fbf5d0ef67319c91acb5cf"');
        await queryRunner.query('DROP INDEX "public"."IDX_1a2a0e662671b2b7c7fa91f69e"');
        await queryRunner.query('DROP INDEX "public"."IDX_df44729e08fd30342df4e3fc9d"');
        await queryRunner.query('DROP TABLE "users_and_projects"');
        await queryRunner.query('DROP TABLE "sprints"');
        await queryRunner.query('DROP TABLE "comments"');
        await queryRunner.query('DROP TABLE "tasks"');
        await queryRunner.query('DROP TYPE "public"."tasks_status_enum"');
        await queryRunner.query('DROP TABLE "projects"');
        await queryRunner.query('DROP TABLE "users"');
    }

}
