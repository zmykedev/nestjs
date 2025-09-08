import { AppModule } from '../app.module';

describe('Main Bootstrap', () => {
  it('should be defined', () => {
    expect(AppModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof AppModule).toBe('function');
  });

  it('should be instantiable', () => {
    const module = new AppModule();
    expect(module).toBeDefined();
    expect(module).toBeInstanceOf(AppModule);
  });
});
