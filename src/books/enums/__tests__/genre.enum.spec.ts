import { Genre } from '../genre.enum';

describe('Genre Enum', () => {
  it('should have all expected genre values', () => {
    expect(Genre.HISTORIA_INDUSTRIAL_CHILE).toBe('Historia Industrial de Chile');
    expect(Genre.TECNOLOGIA_PROCESOS_INDUSTRIALES).toBe('Tecnología y Procesos Industriales');
    expect(Genre.SOSTENIBILIDAD_MEDIO_AMBIENTE).toBe('Sostenibilidad y Medio Ambiente');
    expect(Genre.ECONOMIA_FORESTAL).toBe('Economía Forestal');
    expect(Genre.CULTURA_CORPORATIVA_LIDERAZGO).toBe('Cultura Corporativa y Liderazgo');
    expect(Genre.INNOVACION_DESARROLLO_TECNOLOGICO).toBe('Innovación y Desarrollo Tecnológico');
    expect(Genre.RESPONSABILIDAD_SOCIAL_EMPRESARIAL).toBe('Responsabilidad Social Empresarial');
    expect(Genre.HISTORIA_EMPRESAS_CHILENAS).toBe('Historia de Empresas Chilenas');
    expect(Genre.BIODIVERSIDAD_CONSERVACION).toBe('Biodiversidad y Conservación');
    expect(Genre.EDUCACION_FORMACION_TECNICA).toBe('Educación y Formación Técnica');
  });

  it('should have correct number of enum values', () => {
    const genreValues = Object.values(Genre);
    expect(genreValues).toHaveLength(10);
  });

  it('should have all values as strings', () => {
    const genreValues = Object.values(Genre);
    genreValues.forEach(value => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should have unique values', () => {
    const genreValues = Object.values(Genre);
    const uniqueValues = new Set(genreValues);
    expect(uniqueValues.size).toBe(genreValues.length);
  });

  it('should contain CMPC and forestal related genres', () => {
    const genreValues = Object.values(Genre);
    const hasCmpcRelated = genreValues.some(value => 
      value.toLowerCase().includes('cmpc') || 
      value.toLowerCase().includes('forestal') ||
      value.toLowerCase().includes('industrial')
    );
    expect(hasCmpcRelated).toBe(true);
  });
});
