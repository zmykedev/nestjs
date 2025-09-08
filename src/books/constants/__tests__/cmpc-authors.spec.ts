import {
  CMPC_AUTHOR_DESCRIPTIONS,
  CMPC_SPECIFIC_AUTHORS,
  TRADITIONAL_AUTHORS,
  CMPC_AUTHORS,
  AuthorDescription,
} from '../cmpc-authors';
import { Author } from '../../enums/author.enum';

describe('CMPC Authors Constants', () => {
  it('should have CMPC_AUTHOR_DESCRIPTIONS defined', () => {
    expect(CMPC_AUTHOR_DESCRIPTIONS).toBeDefined();
    expect(Array.isArray(CMPC_AUTHOR_DESCRIPTIONS)).toBe(true);
  });

  it('should have correct number of author descriptions', () => {
    expect(CMPC_AUTHOR_DESCRIPTIONS).toHaveLength(10);
  });

  it('should have all descriptions with required properties', () => {
    CMPC_AUTHOR_DESCRIPTIONS.forEach((description: AuthorDescription) => {
      expect(description).toHaveProperty('author');
      expect(description).toHaveProperty('description');
      expect(description).toHaveProperty('category');
      expect(typeof description.author).toBe('string');
      expect(typeof description.description).toBe('string');
      expect(['CMPC_SPECIFIC', 'TRADITIONAL']).toContain(description.category);
    });
  });

  it('should have all descriptions as CMPC_SPECIFIC category', () => {
    CMPC_AUTHOR_DESCRIPTIONS.forEach((description: AuthorDescription) => {
      expect(description.category).toBe('CMPC_SPECIFIC');
    });
  });

  it('should have CMPC_SPECIFIC_AUTHORS defined', () => {
    expect(CMPC_SPECIFIC_AUTHORS).toBeDefined();
    expect(Array.isArray(CMPC_SPECIFIC_AUTHORS)).toBe(true);
  });

  it('should have correct number of CMPC specific authors', () => {
    expect(CMPC_SPECIFIC_AUTHORS).toHaveLength(10);
  });

  it('should have all CMPC specific authors as valid Author enum values', () => {
    const validAuthors = Object.values(Author);
    CMPC_SPECIFIC_AUTHORS.forEach((author) => {
      expect(validAuthors).toContain(author);
    });
  });

  it('should have TRADITIONAL_AUTHORS defined', () => {
    expect(TRADITIONAL_AUTHORS).toBeDefined();
    expect(Array.isArray(TRADITIONAL_AUTHORS)).toBe(true);
  });

  it('should have CMPC_AUTHORS alias defined', () => {
    expect(CMPC_AUTHORS).toBeDefined();
    expect(CMPC_AUTHORS).toBe(CMPC_SPECIFIC_AUTHORS);
  });

  it('should have no overlap between CMPC_SPECIFIC_AUTHORS and TRADITIONAL_AUTHORS', () => {
    const overlap = CMPC_SPECIFIC_AUTHORS.filter((author) =>
      TRADITIONAL_AUTHORS.includes(author),
    );
    expect(overlap).toHaveLength(0);
  });

  it('should have all Author enum values covered', () => {
    const allAuthors = [...CMPC_SPECIFIC_AUTHORS, ...TRADITIONAL_AUTHORS];
    const uniqueAuthors = new Set(allAuthors);
    expect(uniqueAuthors.size).toBe(Object.values(Author).length);
  });

  it('should have Luis Matte Larraín as CMPC specific author', () => {
    expect(CMPC_SPECIFIC_AUTHORS).toContain(Author.LUIS_MATTE_LARRAIN);
  });

  it('should have meaningful descriptions', () => {
    CMPC_AUTHOR_DESCRIPTIONS.forEach((description: AuthorDescription) => {
      expect(description.description.length).toBeGreaterThan(20);
      // Some descriptions may not contain 'CMPC' directly but are related to the industry
      expect(description.description).toMatch(/CMPC|industria|forestal|técnicas|investigación|empresas|corporativa|organizacional/i);
    });
  });
});
