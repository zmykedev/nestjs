import { getEnvFilePath } from '../envFile';
import { environments } from '../../../environments';

// Mock process.env
const originalEnv = process.env;

describe('envFile', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return default .env when NODE_ENV is not set', () => {
    delete process.env.NODE_ENV;
    const result = getEnvFilePath();
    expect(result).toBe('.env');
  });

  it('should return correct env file for development', () => {
    process.env.NODE_ENV = 'development';
    const result = getEnvFilePath();
    expect(result).toBe(environments.development);
  });

  it('should return correct env file for dev', () => {
    process.env.NODE_ENV = 'dev';
    const result = getEnvFilePath();
    expect(result).toBe(environments.dev);
  });

  it('should return correct env file for test', () => {
    process.env.NODE_ENV = 'test';
    const result = getEnvFilePath();
    expect(result).toBe(environments.test);
  });

  it('should return correct env file for staging', () => {
    process.env.NODE_ENV = 'stag';
    const result = getEnvFilePath();
    expect(result).toBe(environments.stag);
  });

  it('should return correct env file for production', () => {
    process.env.NODE_ENV = 'prod';
    const result = getEnvFilePath();
    expect(result).toBe(environments.prod);
  });

  it('should return default .env for unknown environment', () => {
    process.env.NODE_ENV = 'unknown';
    const result = getEnvFilePath();
    expect(result).toBe('.env');
  });

  it('should be a function', () => {
    expect(typeof getEnvFilePath).toBe('function');
  });

  it('should return a string', () => {
    const result = getEnvFilePath();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
