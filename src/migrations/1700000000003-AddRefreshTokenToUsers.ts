import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenToUsers1700000000003 implements MigrationInterface {
  name = 'AddRefreshTokenToUsers1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add refresh_token column to users table
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN refresh_token VARCHAR(255) NULL
    `);

    // Create index for refresh_token for better query performance
    await queryRunner.query(`
      CREATE INDEX IDX_USERS_REFRESH_TOKEN ON users (refresh_token)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index first
    await queryRunner.query(`
      DROP INDEX IF EXISTS IDX_USERS_REFRESH_TOKEN
    `);

    // Remove refresh_token column from users table
    await queryRunner.query(`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS refresh_token
    `);
  }
}
