import config from '../config';

// Mock process.env
const originalEnv = process.env;

describe('Config', () => {
  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original process.env after all tests
    process.env = originalEnv;
  });

  it('should return default configuration when no env vars are set', () => {
    // Clear all environment variables
    delete process.env.PORT;
    delete process.env.DATABASE_HOST;
    delete process.env.DATABASE_PORT;
    delete process.env.DATABASE_USER;
    delete process.env.DATABASE_PASSWORD;
    delete process.env.DATABASE_NAME;
    delete process.env.NODE_ENV;
    delete process.env.CORS;
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.REFRESH_TOKEN_EXPIRATION;
    delete process.env.ACCESS_TOKEN_EXPIRATION;
    delete process.env.IMGBB_API_KEY;

    const configResult = config();

    expect(configResult.port).toBe(3000);
    expect(configResult.db.host).toBe('localhost');
    expect(configResult.db.port).toBe(5432);
    expect(configResult.db.user).toBeUndefined();
    expect(configResult.db.password).toBeUndefined();
    expect(configResult.db.name).toBeUndefined();
    expect(configResult.devtools.enabled).toBe(true);
    expect(configResult.devtools.port).toBe(8000);
    expect(configResult.env).toBeUndefined();
    expect(configResult.cors).toBeUndefined();
    expect(configResult.jwt.jwtSecret).toBe('defaultSecret123');
    expect(configResult.jwt.jwtRefreshSecret).toBe('defaultRefreshSecret123');
    expect(configResult.jwt.refreshTokenExpiration).toBe('7d');
    expect(configResult.jwt.accessTokenExpiration).toBe('1h');
    expect(configResult.imgbb.apiKey).toBeUndefined();
  });

  it('should use environment variables when provided', () => {
    process.env.PORT = '4000';
    process.env.DATABASE_HOST = 'db.example.com';
    process.env.DATABASE_PORT = '3306';
    process.env.DATABASE_USER = 'testuser';
    process.env.DATABASE_PASSWORD = 'testpass';
    process.env.DATABASE_NAME = 'testdb';
    process.env.NODE_ENV = 'production';
    process.env.CORS = 'https://example.com';
    process.env.JWT_SECRET = 'custom-secret';
    process.env.JWT_REFRESH_SECRET = 'custom-refresh-secret';
    process.env.REFRESH_TOKEN_EXPIRATION = '30d';
    process.env.ACCESS_TOKEN_EXPIRATION = '2h';
    process.env.IMGBB_API_KEY = 'imgbb-key-123';

    const configResult = config();

    expect(configResult.port).toBe(4000);
    expect(configResult.db.host).toBe('db.example.com');
    expect(configResult.db.port).toBe(3306);
    expect(configResult.db.user).toBe('testuser');
    expect(configResult.db.password).toBe('testpass');
    expect(configResult.db.name).toBe('testdb');
    expect(configResult.devtools.enabled).toBe(false);
    expect(configResult.devtools.port).toBe(8000);
    expect(configResult.env).toBe('production');
    expect(configResult.cors).toBe('https://example.com');
    expect(configResult.jwt.jwtSecret).toBe('custom-secret');
    expect(configResult.jwt.jwtRefreshSecret).toBe('custom-refresh-secret');
    expect(configResult.jwt.refreshTokenExpiration).toBe('30d');
    expect(configResult.jwt.accessTokenExpiration).toBe('2h');
    expect(configResult.imgbb.apiKey).toBe('imgbb-key-123');
  });

  it('should handle mixed environment variables', () => {
    process.env.PORT = '5000';
    process.env.DATABASE_HOST = 'localhost';
    process.env.NODE_ENV = 'development';
    process.env.JWT_SECRET = 'dev-secret';
    // Other variables not set

    const configResult = config();

    expect(configResult.port).toBe(5000);
    expect(configResult.db.host).toBe('localhost');
    expect(configResult.db.port).toBe(5432); // default
    expect(configResult.db.user).toBeUndefined(); // not set
    expect(configResult.devtools.enabled).toBe(true); // development
    expect(configResult.env).toBe('development');
    expect(configResult.jwt.jwtSecret).toBe('dev-secret');
    expect(configResult.jwt.jwtRefreshSecret).toBe('defaultRefreshSecret123'); // default
  });

  it('should convert port and database port to numbers', () => {
    process.env.PORT = '8080';
    process.env.DATABASE_PORT = '5433';

    const configResult = config();

    expect(typeof configResult.port).toBe('number');
    expect(configResult.port).toBe(8080);
    expect(typeof configResult.db.port).toBe('number');
    expect(configResult.db.port).toBe(5433);
  });

  it('should handle production environment correctly', () => {
    process.env.NODE_ENV = 'production';

    const configResult = config();

    expect(configResult.devtools.enabled).toBe(false);
  });

  it('should handle non-production environments correctly', () => {
    process.env.NODE_ENV = 'development';

    const configResult = config();

    expect(configResult.devtools.enabled).toBe(true);
  });

  it('should return a function that returns configuration object', () => {
    expect(typeof config).toBe('function');
    
    const result = config();
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('port');
    expect(result).toHaveProperty('db');
    expect(result).toHaveProperty('devtools');
    expect(result).toHaveProperty('env');
    expect(result).toHaveProperty('cors');
    expect(result).toHaveProperty('jwt');
    expect(result).toHaveProperty('imgbb');
  });
});
