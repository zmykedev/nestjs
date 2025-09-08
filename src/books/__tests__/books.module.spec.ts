import { BooksModule } from '../books.module';

describe('BooksModule', () => {
  it('should be defined', () => {
    expect(BooksModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof BooksModule).toBe('function');
  });

  it('should be instantiable', () => {
    const module = new BooksModule();
    expect(module).toBeDefined();
    expect(module).toBeInstanceOf(BooksModule);
  });
});
