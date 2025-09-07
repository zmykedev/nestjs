"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRefreshTokenToUsers1700000000003 = void 0;
class AddRefreshTokenToUsers1700000000003 {
    constructor() {
        this.name = 'AddRefreshTokenToUsers1700000000003';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN refresh_token VARCHAR(255) NULL
    `);
        await queryRunner.query(`
      CREATE INDEX IDX_USERS_REFRESH_TOKEN ON users (refresh_token)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      DROP INDEX IF EXISTS IDX_USERS_REFRESH_TOKEN
    `);
        await queryRunner.query(`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS refresh_token
    `);
    }
}
exports.AddRefreshTokenToUsers1700000000003 = AddRefreshTokenToUsers1700000000003;
//# sourceMappingURL=1700000000003-AddRefreshTokenToUsers.js.map