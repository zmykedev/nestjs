import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UpdateAuditLogsTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primero, eliminar la tabla existente
    await queryRunner.dropTable('audit_logs');

    // Crear la nueva tabla con la estructura moderna
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'user_email',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'user_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'entity_type',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'entity_id',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'request_data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'response_data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'SUCCESS'",
          },
          {
            name: 'level',
            type: 'varchar',
            length: '20',
            default: "'INFO'",
          },
          {
            name: 'ip_address',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'endpoint',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'http_method',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'response_time_ms',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Crear índices para optimizar consultas
    await queryRunner.query(
      'CREATE INDEX IDX_AUDIT_LOGS_USER_ID_CREATED_AT ON audit_logs (user_id, created_at)',
    );
    await queryRunner.query(
      'CREATE INDEX IDX_AUDIT_LOGS_ENTITY_TYPE_ENTITY_ID ON audit_logs (entity_type, entity_id)',
    );
    await queryRunner.query(
      'CREATE INDEX IDX_AUDIT_LOGS_ACTION_CREATED_AT ON audit_logs (action, created_at)',
    );
    await queryRunner.query(
      'CREATE INDEX IDX_AUDIT_LOGS_STATUS_CREATED_AT ON audit_logs (status, created_at)',
    );
    await queryRunner.query(
      'CREATE INDEX IDX_AUDIT_LOGS_LEVEL_CREATED_AT ON audit_logs (level, created_at)',
    );
    await queryRunner.query(
      'CREATE INDEX IDX_AUDIT_LOGS_IS_ACTIVE ON audit_logs (is_active)',
    );
    await queryRunner.query(
      'CREATE INDEX IDX_AUDIT_LOGS_DELETED_AT ON audit_logs (deleted_at)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir a la estructura anterior
    await queryRunner.dropTable('audit_logs');

    // Recrear la tabla anterior
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'table_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'record_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'old_values',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'new_values',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }
}
