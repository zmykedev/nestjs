import { AuthModule } from '../auth.module';

describe('AuthModule', () => {
  it('should be defined', () => {
    expect(AuthModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof AuthModule).toBe('function');
  });

  it('should be instantiable', () => {
    const module = new AuthModule();
    expect(module).toBeDefined();
    expect(module).toBeInstanceOf(AuthModule);
  });
});
