import { Author } from '../author.enum';

describe('Author Enum', () => {
  it('should have all expected author values', () => {
    expect(Author.LUIS_MATTE_LARRAIN).toBe('Luis Matte Larraín');
    expect(Author.EXPERTOS_INGENIERIA_FORESTAL).toBe('Expertos en Ingeniería Forestal');
    expect(Author.ECONOMISTAS_AMBIENTALES).toBe('Economistas Ambientales');
    expect(Author.HISTORIADORES_INDUSTRIALES_CHILENOS).toBe('Historiadores Industriales Chilenos');
    expect(Author.LIDERES_CMPC).toBe('Líderes de CMPC');
    expect(Author.INVESTIGADORES_SOSTENIBILIDAD).toBe('Investigadores en Sostenibilidad');
    expect(Author.SOCIOLOGOS_ORGANIZACIONALES).toBe('Sociólogos Organizacionales');
    expect(Author.ESPECIALISTAS_INNOVACION_TECNOLOGICA).toBe('Especialistas en Innovación Tecnológica');
    expect(Author.ACTIVISTAS_AMBIENTALES).toBe('Activistas Ambientales');
    expect(Author.EDUCADORES_TECNICOS).toBe('Educadores Técnicos');
  });

  it('should have correct number of enum values', () => {
    const authorValues = Object.values(Author);
    expect(authorValues).toHaveLength(10);
  });

  it('should have all values as strings', () => {
    const authorValues = Object.values(Author);
    authorValues.forEach(value => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should have unique values', () => {
    const authorValues = Object.values(Author);
    const uniqueValues = new Set(authorValues);
    expect(uniqueValues.size).toBe(authorValues.length);
  });
});
