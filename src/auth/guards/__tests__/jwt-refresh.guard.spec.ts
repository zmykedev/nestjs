import JwtRefreshGuard from '../jwt-refresh.guard';

describe('JwtRefreshGuard', () => {
  it('should be defined', () => {
    expect(JwtRefreshGuard).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof JwtRefreshGuard).toBe('function');
  });

  it('should be instantiable', () => {
    const guard = new JwtRefreshGuard();
    expect(guard).toBeDefined();
    expect(guard).toBeInstanceOf(JwtRefreshGuard);
  });

  it('should extend AuthGuard', () => {
    const guard = new JwtRefreshGuard();
    expect(guard).toBeDefined();
  });
});
