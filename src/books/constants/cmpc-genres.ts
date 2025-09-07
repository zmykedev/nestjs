import { Genre } from '../enums/genre.enum';

export interface GenreDescription {
  genre: Genre;
  description: string;
  category: 'CMPC_SPECIFIC' | 'TRADITIONAL';
}

export const CMPC_GENRE_DESCRIPTIONS: GenreDescription[] = [
  // Géneros específicos de CMPC
  {
    genre: Genre.HISTORIA_INDUSTRIAL_CHILE,
    description:
      'Libros que aborden el desarrollo industrial en Chile, con énfasis en la industria forestal y papelera.',
    category: 'CMPC_SPECIFIC',
  },
  {
    genre: Genre.TECNOLOGIA_PROCESOS_INDUSTRIALES,
    description:
      'Publicaciones sobre las tecnologías utilizadas en la producción de celulosa, papel y productos derivados.',
    category: 'CMPC_SPECIFIC',
  },
  {
    genre: Genre.SOSTENIBILIDAD_MEDIO_AMBIENTE,
    description:
      'Obras que traten sobre prácticas sostenibles en la industria forestal y la gestión ambiental.',
    category: 'CMPC_SPECIFIC',
  },
  {
    genre: Genre.ECONOMIA_FORESTAL,
    description:
      'Libros que analicen la economía de la industria forestal, incluyendo mercados, comercio y políticas públicas.',
    category: 'CMPC_SPECIFIC',
  },
  {
    genre: Genre.CULTURA_CORPORATIVA_LIDERAZGO,
    description:
      'Publicaciones que exploren la cultura organizacional, liderazgo y gestión en empresas industriales.',
    category: 'CMPC_SPECIFIC',
  },
  {
    genre: Genre.INNOVACION_DESARROLLO_TECNOLOGICO,
    description:
      'Obras que discutan avances tecnológicos y su aplicación en la industria del papel y la celulosa.',
    category: 'CMPC_SPECIFIC',
  },
  {
    genre: Genre.RESPONSABILIDAD_SOCIAL_EMPRESARIAL,
    description:
      'Libros que aborden cómo las empresas gestionan su impacto social y comunitario.',
    category: 'CMPC_SPECIFIC',
  },
  {
    genre: Genre.HISTORIA_EMPRESAS_CHILENAS,
    description:
      'Publicaciones que narren la evolución de empresas chilenas destacadas, incluyendo CMPC.',
    category: 'CMPC_SPECIFIC',
  },
  {
    genre: Genre.BIODIVERSIDAD_CONSERVACION,
    description:
      'Obras que traten sobre la biodiversidad en las zonas donde CMPC opera y sus esfuerzos de conservación.',
    category: 'CMPC_SPECIFIC',
  },
  {
    genre: Genre.EDUCACION_FORMACION_TECNICA,
    description:
      'Libros que aborden la formación técnica en áreas relacionadas con la industria forestal y papelera.',
    category: 'CMPC_SPECIFIC',
  },
];

export const CMPC_SPECIFIC_GENRES = CMPC_GENRE_DESCRIPTIONS.filter(
  (g) => g.category === 'CMPC_SPECIFIC',
).map((g) => g.genre);

export const TRADITIONAL_GENRES = Object.values(Genre).filter(
  (genre) => !CMPC_SPECIFIC_GENRES.includes(genre),
);
