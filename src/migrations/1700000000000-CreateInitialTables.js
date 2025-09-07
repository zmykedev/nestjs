"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitialTables1700000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateInitialTables1700000000000 {
    constructor() {
        this.name = 'CreateInitialTables1700000000000';
    }
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'roles',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '50',
                    isUnique: true,
                },
                {
                    name: 'description',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
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
            ],
        }), true);
        await queryRunner.query(`
      INSERT INTO roles (name, description) VALUES 
      ('admin', 'Administrador del sistema'),
      ('user', 'Usuario estándar'),
      ('librarian', 'Bibliotecario')
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'role_id',
                    type: 'int',
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'last_login',
                    type: 'timestamp',
                    isNullable: true,
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
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'genres',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                    isUnique: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
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
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'publishers',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                },
                {
                    name: 'country',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'website',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
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
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'authors',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'biography',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'birth_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'death_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'nationality',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
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
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'books',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'publication_year',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'edition',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'pages',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'language',
                    type: 'varchar',
                    length: '50',
                    default: "'Español'",
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'cover_image',
                    type: 'varchar',
                    length: '500',
                    isNullable: true,
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'stock_quantity',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'minimum_stock',
                    type: 'int',
                    default: 5,
                },
                {
                    name: 'genre_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'publisher_id',
                    type: 'int',
                    isNullable: true,
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
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'book_authors',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'book_id',
                    type: 'int',
                },
                {
                    name: 'author_id',
                    type: 'int',
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
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'auth_sessions',
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
                    type: 'int',
                },
                {
                    name: 'access_token',
                    type: 'varchar',
                    length: '1000',
                },
                {
                    name: 'refresh_token',
                    type: 'varchar',
                    length: '1000',
                },
                {
                    name: 'token_type',
                    type: 'varchar',
                    length: '50',
                    default: "'Bearer'",
                },
                {
                    name: 'expires_at',
                    type: 'timestamp',
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
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
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
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'action',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'table_name',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'record_id',
                    type: 'int',
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
                },
            ],
        }), true);
        await queryRunner.query('CREATE INDEX IDX_USERS_EMAIL ON users (email)');
        await queryRunner.query('CREATE INDEX IDX_USERS_ROLE ON users (role_id)');
        await queryRunner.query('CREATE INDEX IDX_USERS_ACTIVE ON users (is_active)');
        await queryRunner.query('CREATE INDEX IDX_USERS_DELETED ON users (deleted_at)');
        await queryRunner.query('CREATE INDEX IDX_BOOKS_TITLE ON books (title)');
        await queryRunner.query('CREATE INDEX IDX_BOOKS_GENRE ON books (genre_id)');
        await queryRunner.query('CREATE INDEX IDX_BOOKS_PUBLISHER ON books (publisher_id)');
        await queryRunner.query('CREATE INDEX IDX_BOOKS_YEAR ON books (publication_year)');
        await queryRunner.query('CREATE INDEX IDX_BOOKS_STOCK ON books (stock_quantity)');
        await queryRunner.query('CREATE INDEX IDX_BOOKS_ACTIVE ON books (is_active)');
        await queryRunner.query('CREATE INDEX IDX_BOOKS_DELETED ON books (deleted_at)');
        await queryRunner.query('CREATE INDEX IDX_BOOKS_TITLE_ACTIVE ON books (title, is_active)');
        await queryRunner.query('CREATE INDEX IDX_BOOKS_GENRE_ACTIVE ON books (genre_id, is_active)');
        await queryRunner.query('CREATE INDEX IDX_BOOKS_PUBLISHER_ACTIVE ON books (publisher_id, is_active)');
        await queryRunner.query('CREATE INDEX IDX_AUTHORS_NAME ON authors (first_name, last_name)');
        await queryRunner.query('CREATE INDEX IDX_AUTHORS_ACTIVE ON authors (is_active)');
        await queryRunner.query('CREATE INDEX IDX_AUTHORS_DELETED ON authors (deleted_at)');
        await queryRunner.query('CREATE INDEX IDX_GENRES_NAME ON genres (name)');
        await queryRunner.query('CREATE INDEX IDX_GENRES_ACTIVE ON genres (is_active)');
        await queryRunner.query('CREATE INDEX IDX_GENRES_DELETED ON genres (deleted_at)');
        await queryRunner.query('CREATE INDEX IDX_PUBLISHERS_NAME ON publishers (name)');
        await queryRunner.query('CREATE INDEX IDX_PUBLISHERS_COUNTRY ON publishers (country)');
        await queryRunner.query('CREATE INDEX IDX_PUBLISHERS_ACTIVE ON publishers (is_active)');
        await queryRunner.query('CREATE INDEX IDX_PUBLISHERS_DELETED ON publishers (deleted_at)');
        await queryRunner.query('CREATE INDEX IDX_BOOK_AUTHORS_BOOK ON book_authors (book_id)');
        await queryRunner.query('CREATE INDEX IDX_BOOK_AUTHORS_AUTHOR ON book_authors (author_id)');
        await queryRunner.query('CREATE INDEX IDX_BOOK_AUTHORS_ACTIVE ON book_authors (is_active)');
        await queryRunner.query('CREATE INDEX IDX_BOOK_AUTHORS_DELETED ON book_authors (deleted_at)');
        await queryRunner.query('CREATE INDEX IDX_AUTH_SESSIONS_USER ON auth_sessions (user_id)');
        await queryRunner.query('CREATE INDEX IDX_AUTH_SESSIONS_TOKEN ON auth_sessions (access_token)');
        await queryRunner.query('CREATE INDEX IDX_AUTH_SESSIONS_REFRESH ON auth_sessions (refresh_token)');
        await queryRunner.query('CREATE INDEX IDX_AUTH_SESSIONS_EXPIRES ON auth_sessions (expires_at)');
        await queryRunner.query('CREATE INDEX IDX_AUTH_SESSIONS_ACTIVE ON auth_sessions (is_active)');
        await queryRunner.query('CREATE INDEX IDX_AUTH_SESSIONS_DELETED ON auth_sessions (deleted_at)');
        await queryRunner.query('CREATE INDEX IDX_AUDIT_LOGS_USER ON audit_logs (user_id)');
        await queryRunner.query('CREATE INDEX IDX_AUDIT_LOGS_ACTION ON audit_logs (action)');
        await queryRunner.query('CREATE INDEX IDX_AUDIT_LOGS_TABLE ON audit_logs (table_name)');
        await queryRunner.query('CREATE INDEX IDX_AUDIT_LOGS_RECORD ON audit_logs (record_id)');
        await queryRunner.query('CREATE INDEX IDX_AUDIT_LOGS_CREATED ON audit_logs (created_at)');
        await queryRunner.query('CREATE INDEX IDX_AUDIT_LOGS_USER_ACTION ON audit_logs (user_id, action)');
        await queryRunner.query('CREATE INDEX IDX_AUDIT_LOGS_TABLE_RECORD ON audit_logs (table_name, record_id)');
        await queryRunner.query('CREATE INDEX IDX_AUDIT_LOGS_ACTION_CREATED ON audit_logs (action, created_at)');
        await queryRunner.query(`
      ALTER TABLE users 
      ADD CONSTRAINT FK_USERS_ROLE 
      FOREIGN KEY (role_id) REFERENCES roles(id) 
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE books 
      ADD CONSTRAINT FK_BOOKS_GENRE 
      FOREIGN KEY (genre_id) REFERENCES genres(id) 
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE books 
      ADD CONSTRAINT FK_BOOKS_PUBLISHER 
      FOREIGN KEY (publisher_id) REFERENCES publishers(id) 
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE book_authors 
      ADD CONSTRAINT FK_BOOK_AUTHORS_BOOK 
      FOREIGN KEY (book_id) REFERENCES books(id) 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE book_authors 
      ADD CONSTRAINT FK_BOOK_AUTHORS_AUTHOR 
      FOREIGN KEY (author_id) REFERENCES authors(id) 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE auth_sessions 
      ADD CONSTRAINT FK_AUTH_SESSIONS_USER 
      FOREIGN KEY (user_id) REFERENCES users(id) 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE audit_logs 
      ADD CONSTRAINT FK_AUDIT_LOGS_USER 
      FOREIGN KEY (user_id) REFERENCES users(id) 
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      INSERT INTO genres (name, description) VALUES 
      ('Ficción', 'Obras de ficción literaria'),
      ('No Ficción', 'Obras basadas en hechos reales'),
      ('Ciencia Ficción', 'Ficción basada en avances científicos'),
      ('Fantasía', 'Ficción con elementos mágicos'),
      ('Misterio', 'Obras de suspense y misterio'),
      ('Romance', 'Obras románticas'),
      ('Historia', 'Obras históricas'),
      ('Ciencia', 'Obras científicas'),
      ('Tecnología', 'Obras sobre tecnología'),
      ('Negocios', 'Obras sobre negocios y economía')
    `);
        await queryRunner.query(`
      INSERT INTO publishers (name, country) VALUES 
      ('Penguin Random House', 'Estados Unidos'),
      ('HarperCollins', 'Estados Unidos'),
      ('Simon & Schuster', 'Estados Unidos'),
      ('Macmillan', 'Estados Unidos'),
      ('Hachette', 'Francia'),
      ('Planeta', 'España'),
      ('Santillana', 'España'),
      ('Alfaguara', 'España'),
      ('Anagrama', 'España'),
      ('Tusquets', 'España')
    `);
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS FK_AUDIT_LOGS_USER');
        await queryRunner.query('ALTER TABLE auth_sessions DROP CONSTRAINT IF EXISTS FK_AUTH_SESSIONS_USER');
        await queryRunner.query('ALTER TABLE book_authors DROP CONSTRAINT IF EXISTS FK_BOOK_AUTHORS_AUTHOR');
        await queryRunner.query('ALTER TABLE book_authors DROP CONSTRAINT IF EXISTS FK_BOOK_AUTHORS_BOOK');
        await queryRunner.query('ALTER TABLE books DROP CONSTRAINT IF EXISTS FK_BOOKS_PUBLISHER');
        await queryRunner.query('ALTER TABLE books DROP CONSTRAINT IF EXISTS FK_BOOKS_GENRE');
        await queryRunner.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS FK_USERS_ROLE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUDIT_LOGS_ACTION_CREATED');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUDIT_LOGS_TABLE_RECORD');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUDIT_LOGS_USER_ACTION');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_PUBLISHER_ACTIVE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_GENRE_ACTIVE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_TITLE_ACTIVE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUDIT_LOGS_CREATED');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUDIT_LOGS_RECORD');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUDIT_LOGS_TABLE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUDIT_LOGS_ACTION');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUDIT_LOGS_USER');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUTH_SESSIONS_DELETED');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUTH_SESSIONS_ACTIVE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUTH_SESSIONS_EXPIRES');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUTH_SESSIONS_REFRESH');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUTH_SESSIONS_TOKEN');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUTH_SESSIONS_USER');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOK_AUTHORS_DELETED');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOK_AUTHORS_ACTIVE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOK_AUTHORS_AUTHOR');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOK_AUTHORS_BOOK');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_PUBLISHERS_DELETED');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_PUBLISHERS_ACTIVE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_PUBLISHERS_COUNTRY');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_PUBLISHERS_NAME');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_GENRES_DELETED');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_GENRES_ACTIVE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_GENRES_NAME');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUTHORS_DELETED');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUTHORS_ACTIVE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_AUTHORS_NAME');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_DELETED');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_ACTIVE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_STOCK');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_YEAR');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_PUBLISHER');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_GENRE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_TITLE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_USERS_DELETED');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_BOOKS_ACTIVE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_USERS_ROLE');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_USERS_EMAIL');
        await queryRunner.dropTable('audit_logs');
        await queryRunner.dropTable('auth_sessions');
        await queryRunner.dropTable('book_authors');
        await queryRunner.dropTable('books');
        await queryRunner.dropTable('authors');
        await queryRunner.dropTable('publishers');
        await queryRunner.dropTable('genres');
        await queryRunner.dropTable('users');
        await queryRunner.dropTable('roles');
    }
}
exports.CreateInitialTables1700000000000 = CreateInitialTables1700000000000;
//# sourceMappingURL=1700000000000-CreateInitialTables.js.map