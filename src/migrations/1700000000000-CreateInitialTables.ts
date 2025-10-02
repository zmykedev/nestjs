import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla de usuarios
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "first_name" character varying(100) NOT NULL,
        "last_name" character varying(100) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "last_login" TIMESTAMP,
        "refresh_token" character varying(500),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Crear tabla de sesiones de autenticación
    await queryRunner.query(`
      CREATE TABLE "auth_sessions" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "access_token" character varying(1000) NOT NULL,
        "refresh_token" character varying(1000) NOT NULL,
        "token_type" character varying(50) NOT NULL DEFAULT 'Bearer',
        "expires_at" TIMESTAMP NOT NULL,
        "ip_address" character varying(45),
        "user_agent" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_auth_sessions" PRIMARY KEY ("id")
      )
    `);

    // Crear tabla de logs de auditoría
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" SERIAL NOT NULL,
        "user_id" integer,
        "action" character varying(100) NOT NULL,
        "table_name" character varying(100),
        "record_id" integer,
        "old_values" json,
        "new_values" json,
        "ip_address" character varying(45),
        "user_agent" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);

    // Crear índices
    await queryRunner.query(
      'CREATE INDEX "IDX_users_email" ON "users" ("email")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_users_is_active" ON "users" ("is_active")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_users_deleted_at" ON "users" ("deleted_at")',
    );

    await queryRunner.query(
      'CREATE INDEX "IDX_auth_sessions_user_id" ON "auth_sessions" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_auth_sessions_access_token" ON "auth_sessions" ("access_token")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_auth_sessions_refresh_token" ON "auth_sessions" ("refresh_token")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_auth_sessions_expires_at" ON "auth_sessions" ("expires_at")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_auth_sessions_is_active" ON "auth_sessions" ("is_active")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_auth_sessions_deleted_at" ON "auth_sessions" ("deleted_at")',
    );

    await queryRunner.query(
      'CREATE INDEX "IDX_audit_logs_user_id" ON "audit_logs" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_audit_logs_action" ON "audit_logs" ("action")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_audit_logs_table_name" ON "audit_logs" ("table_name")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_audit_logs_record_id" ON "audit_logs" ("record_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_audit_logs_created_at" ON "audit_logs" ("created_at")',
    );

    // Crear foreign keys

    await queryRunner.query(`
      ALTER TABLE "auth_sessions" 
      ADD CONSTRAINT "FK_auth_sessions_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "audit_logs" 
      ADD CONSTRAINT "FK_audit_logs_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") 
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys
    await queryRunner.query(
      'ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_audit_logs_user_id"',
    );
    await queryRunner.query(
      'ALTER TABLE "auth_sessions" DROP CONSTRAINT "FK_auth_sessions_user_id"',
    );

    // Eliminar índices
    await queryRunner.query('DROP INDEX "IDX_audit_logs_created_at"');
    await queryRunner.query('DROP INDEX "IDX_audit_logs_record_id"');
    await queryRunner.query('DROP INDEX "IDX_audit_logs_table_name"');
    await queryRunner.query('DROP INDEX "IDX_audit_logs_action"');
    await queryRunner.query('DROP INDEX "IDX_audit_logs_user_id"');

    await queryRunner.query('DROP INDEX "IDX_auth_sessions_deleted_at"');
    await queryRunner.query('DROP INDEX "IDX_auth_sessions_is_active"');
    await queryRunner.query('DROP INDEX "IDX_auth_sessions_expires_at"');
    await queryRunner.query('DROP INDEX "IDX_auth_sessions_refresh_token"');
    await queryRunner.query('DROP INDEX "IDX_auth_sessions_access_token"');
    await queryRunner.query('DROP INDEX "IDX_auth_sessions_user_id"');

    await queryRunner.query('DROP INDEX "IDX_users_deleted_at"');
    await queryRunner.query('DROP INDEX "IDX_users_is_active"');
    await queryRunner.query('DROP INDEX "IDX_users_email"');

    // Eliminar tablas
    await queryRunner.query('DROP TABLE "audit_logs"');
    await queryRunner.query('DROP TABLE "auth_sessions"');
    await queryRunner.query('DROP TABLE "users"');
  }
}
