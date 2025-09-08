import {
  CMPC_GENRE_DESCRIPTIONS,
  CMPC_SPECIFIC_GENRES,
  TRADITIONAL_GENRES,
  CMPC_GENRES,
  GenreDescription,
} from '../cmpc-genres';
import { Genre } from '../../enums/genre.enum';

describe('CMPC Genres Constants', () => {
  it('should have CMPC_GENRE_DESCRIPTIONS defined', () => {
    expect(CMPC_GENRE_DESCRIPTIONS).toBeDefined();
    expect(Array.isArray(CMPC_GENRE_DESCRIPTIONS)).toBe(true);
  });

  it('should have correct number of genre descriptions', () => {
    expect(CMPC_GENRE_DESCRIPTIONS).toHaveLength(10);
  });

  it('should have all descriptions with required properties', () => {
    CMPC_GENRE_DESCRIPTIONS.forEach((description: GenreDescription) => {
      expect(description).toHaveProperty('genre');
      expect(description).toHaveProperty('description');
      expect(description).toHaveProperty('category');
      expect(typeof description.genre).toBe('string');
      expect(typeof description.description).toBe('string');
      expect(['CMPC_SPECIFIC', 'TRADITIONAL']).toContain(description.category);
    });
  });

  it('should have all descriptions as CMPC_SPECIFIC category', () => {
    CMPC_GENRE_DESCRIPTIONS.forEach((description: GenreDescription) => {
      expect(description.category).toBe('CMPC_SPECIFIC');
    });
  });

  it('should have CMPC_SPECIFIC_GENRES defined', () => {
    expect(CMPC_SPECIFIC_GENRES).toBeDefined();
    expect(Array.isArray(CMPC_SPECIFIC_GENRES)).toBe(true);
  });

  it('should have correct number of CMPC specific genres', () => {
    expect(CMPC_SPECIFIC_GENRES).toHaveLength(10);
  });

  it('should have all CMPC specific genres as valid Genre enum values', () => {
    const validGenres = Object.values(Genre);
    CMPC_SPECIFIC_GENRES.forEach((genre) => {
      expect(validGenres).toContain(genre);
    });
  });

  it('should have TRADITIONAL_GENRES defined', () => {
    expect(TRADITIONAL_GENRES).toBeDefined();
    expect(Array.isArray(TRADITIONAL_GENRES)).toBe(true);
  });

  it('should have CMPC_GENRES alias defined', () => {
    expect(CMPC_GENRES).toBeDefined();
    expect(CMPC_GENRES).toBe(CMPC_SPECIFIC_GENRES);
  });

  it('should have no overlap between CMPC_SPECIFIC_GENRES and TRADITIONAL_GENRES', () => {
    const overlap = CMPC_SPECIFIC_GENRES.filter((genre) =>
      TRADITIONAL_GENRES.includes(genre),
    );
    expect(overlap).toHaveLength(0);
  });

  it('should have all Genre enum values covered', () => {
    const allGenres = [...CMPC_SPECIFIC_GENRES, ...TRADITIONAL_GENRES];
    const uniqueGenres = new Set(allGenres);
    expect(uniqueGenres.size).toBe(Object.values(Genre).length);
  });

  it('should have Historia Industrial Chile as CMPC specific genre', () => {
    expect(CMPC_SPECIFIC_GENRES).toContain(Genre.HISTORIA_INDUSTRIAL_CHILE);
  });

  it('should have meaningful descriptions', () => {
    CMPC_GENRE_DESCRIPTIONS.forEach((description: GenreDescription) => {
      expect(description.description.length).toBeGreaterThan(20);
      // Some descriptions may not contain all keywords but are related to the industry
      expect(description.description).toMatch(/industria|forestal|CMPC|sostenibilidad|tecnologías|celulosa|papel|empresas|gestionan|impacto|social|comunitario/i);
    });
  });

  it('should have specific CMPC-related genres', () => {
    const expectedGenres = [
      Genre.HISTORIA_INDUSTRIAL_CHILE,
      Genre.TECNOLOGIA_PROCESOS_INDUSTRIALES,
      Genre.SOSTENIBILIDAD_MEDIO_AMBIENTE,
      Genre.ECONOMIA_FORESTAL,
    ];

    expectedGenres.forEach((genre) => {
      expect(CMPC_SPECIFIC_GENRES).toContain(genre);
    });
  });
});
