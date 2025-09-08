import { environments } from '../environments';

describe('Environments', () => {
  it('should have all expected environment configurations', () => {
    expect(environments.dev).toBe('webapp.env');
    expect(environments.development).toBe('webapp.env');
    expect(environments.test).toBe('.env.test');
    expect(environments.stag).toBe('.stag.env');
    expect(environments.prod).toBe('.prod.env');
  });

  it('should have correct number of environments', () => {
    const environmentKeys = Object.keys(environments);
    expect(environmentKeys).toHaveLength(5);
  });

  it('should have all values as strings', () => {
    const environmentValues = Object.values(environments);
    environmentValues.forEach(value => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should have unique values except dev and development', () => {
    const environmentValues = Object.values(environments);
    const uniqueValues = new Set(environmentValues);
    // dev and development point to the same file, so we expect 4 unique values from 5 total
    expect(uniqueValues.size).toBe(4);
    expect(environmentValues.length).toBe(5);
  });

  it('should have dev and development pointing to same file', () => {
    expect(environments.dev).toBe(environments.development);
  });

  it('should have different files for different environments', () => {
    expect(environments.test).not.toBe(environments.stag);
    expect(environments.stag).not.toBe(environments.prod);
    expect(environments.test).not.toBe(environments.prod);
  });

  it('should have proper file extensions', () => {
    const environmentValues = Object.values(environments);
    environmentValues.forEach(value => {
      expect(value).toMatch(/\.(env|test)$/);
    });
  });
});
