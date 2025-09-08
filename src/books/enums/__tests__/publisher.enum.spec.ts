import { Publisher } from '../publisher.enum';

describe('Publisher Enum', () => {
  it('should have CMPC Editorial as first value', () => {
    expect(Publisher.CMPC_EDITORIAL).toBe('CMPC Editorial');
  });

  it('should have Chilean universities', () => {
    expect(Publisher.UNIVERSIDAD_AUSTRAL_CHILE).toBe('Universidad Austral de Chile');
    expect(Publisher.UNIVERSIDAD_DE_CONCEPCION).toBe('Universidad de Concepción');
    expect(Publisher.UNIVERSIDAD_DE_CHILE).toBe('Universidad de Chile');
    expect(Publisher.PONTIFICIA_UNIVERSIDAD_CATOLICA).toBe('Pontificia Universidad Católica');
  });

  it('should have international publishers', () => {
    expect(Publisher.FAO).toBe('Organización de las Naciones Unidas para la Alimentación y la Agricultura');
    expect(Publisher.WORLD_BANK).toBe('Banco Mundial');
    expect(Publisher.SPRINGER).toBe('Springer');
    expect(Publisher.ELSEVIER).toBe('Elsevier');
  });

  it('should have correct number of enum values', () => {
    const publisherValues = Object.values(Publisher);
    expect(publisherValues).toHaveLength(50);
  });

  it('should have all values as strings', () => {
    const publisherValues = Object.values(Publisher);
    publisherValues.forEach(value => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should have unique values', () => {
    const publisherValues = Object.values(Publisher);
    const uniqueValues = new Set(publisherValues);
    expect(uniqueValues.size).toBe(publisherValues.length);
  });

  it('should contain different categories of publishers', () => {
    const publisherValues = Object.values(Publisher);
    
    // Check for Chilean universities
    const hasChileanUniversities = publisherValues.some(value => 
      value.includes('Universidad') && value.includes('Chile')
    );
    expect(hasChileanUniversities).toBe(true);

    // Check for international organizations
    const hasInternationalOrgs = publisherValues.some(value => 
      value.includes('FAO') || value.includes('Banco Mundial')
    );
    expect(hasInternationalOrgs).toBe(true);

    // Check for academic publishers
    const hasAcademicPublishers = publisherValues.some(value => 
      value.includes('Springer') || value.includes('Elsevier')
    );
    expect(hasAcademicPublishers).toBe(true);
  });

  it('should have special cases for unknown/independent publishers', () => {
    expect(Publisher.EDITORIAL_INDEPENDIENTE).toBe('Editorial Independiente');
    expect(Publisher.AUTOEDICION).toBe('Autoedición');
    expect(Publisher.EDITORIAL_DESCONOCIDA).toBe('Editorial Desconocida');
  });
});
