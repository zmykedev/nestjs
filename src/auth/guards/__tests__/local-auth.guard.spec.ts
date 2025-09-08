import { LocalAuthGuard } from '../local-auth.guard';

describe('LocalAuthGuard', () => {
  it('should be defined', () => {
    expect(LocalAuthGuard).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof LocalAuthGuard).toBe('function');
  });

  it('should be instantiable', () => {
    const guard = new LocalAuthGuard();
    expect(guard).toBeDefined();
    expect(guard).toBeInstanceOf(LocalAuthGuard);
  });

  it('should extend AuthGuard', () => {
    const guard = new LocalAuthGuard();
    expect(guard).toBeDefined();
  });
});
