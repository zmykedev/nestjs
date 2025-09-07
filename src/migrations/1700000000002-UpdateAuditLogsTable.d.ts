import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class UpdateAuditLogsTable1700000000002
  implements MigrationInterface
{
  up(queryRunner: QueryRunner): Promise<void>;
  down(queryRunner: QueryRunner): Promise<void>;
}
