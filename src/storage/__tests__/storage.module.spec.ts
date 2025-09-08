import { StorageModule } from '../storage.module';

describe('StorageModule', () => {
  it('should be defined', () => {
    expect(StorageModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof StorageModule).toBe('function');
  });

  it('should be instantiable', () => {
    const module = new StorageModule();
    expect(module).toBeDefined();
    expect(module).toBeInstanceOf(StorageModule);
  });
});
