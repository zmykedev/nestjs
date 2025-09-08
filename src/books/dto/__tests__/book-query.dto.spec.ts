import { BookQueryDto } from '../book-query.dto';
import { QueryBookDto } from '../query-book.dto';

describe('BookQueryDto', () => {
  it('should be defined', () => {
    expect(BookQueryDto).toBeDefined();
  });

  it('should be the same as QueryBookDto', () => {
    expect(BookQueryDto).toBe(QueryBookDto);
  });

  it('should be a class', () => {
    expect(typeof BookQueryDto).toBe('function');
  });

  it('should be instantiable', () => {
    const dto = new BookQueryDto();
    expect(dto).toBeDefined();
    expect(dto).toBeInstanceOf(BookQueryDto);
  });
});
