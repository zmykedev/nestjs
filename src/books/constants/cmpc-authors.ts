import { Author } from '../enums/author.enum';

export interface AuthorDescription {
  author: Author;
  description: string;
  category: 'CMPC_SPECIFIC' | 'TRADITIONAL';
}

export const CMPC_AUTHOR_DESCRIPTIONS: AuthorDescription[] = [
  // Autores específicos de CMPC
  {
    author: Author.LUIS_MATTE_LARRAIN,
    description:
      'Fundador de CMPC, cuyas obras o biografía pueden ofrecer una visión sobre los inicios de la empresa.',
    category: 'CMPC_SPECIFIC',
  },
  {
    author: Author.EXPERTOS_INGENIERIA_FORESTAL,
    description:
      'Autores que hayan trabajado en la investigación y desarrollo de técnicas en la industria forestal.',
    category: 'CMPC_SPECIFIC',
  },
  {
    author: Author.ECONOMISTAS_AMBIENTALES,
    description:
      'Especialistas que analicen la intersección entre economía y medio ambiente en la industria.',
    category: 'CMPC_SPECIFIC',
  },
  {
    author: Author.HISTORIADORES_INDUSTRIALES_CHILENOS,
    description:
      'Investigadores que hayan documentado la historia industrial de Chile y empresas como CMPC.',
    category: 'CMPC_SPECIFIC',
  },
  {
    author: Author.LIDERES_CMPC,
    description:
      'Publicaciones de ejecutivos actuales o pasados de CMPC que compartan su visión y experiencias.',
    category: 'CMPC_SPECIFIC',
  },
  {
    author: Author.INVESTIGADORES_SOSTENIBILIDAD,
    description:
      'Académicos que se centren en prácticas sostenibles en la industria forestal y papelera.',
    category: 'CMPC_SPECIFIC',
  },
  {
    author: Author.SOCIOLOGOS_ORGANIZACIONALES,
    description:
      'Expertos que estudien la cultura corporativa y dinámica organizacional en grandes empresas.',
    category: 'CMPC_SPECIFIC',
  },
  {
    author: Author.ESPECIALISTAS_INNOVACION_TECNOLOGICA,
    description:
      'Autores que investiguen la aplicación de nuevas tecnologías en la industria del papel y la celulosa.',
    category: 'CMPC_SPECIFIC',
  },
  {
    author: Author.ACTIVISTAS_AMBIENTALES,
    description:
      'Personas que hayan trabajado en la promoción de la sostenibilidad y conservación en las áreas de operación de CMPC.',
    category: 'CMPC_SPECIFIC',
  },
  {
    author: Author.EDUCADORES_TECNICOS,
    description:
      'Profesionales que hayan contribuido a la formación técnica en áreas relacionadas con la industria.',
    category: 'CMPC_SPECIFIC',
  },
];

export const CMPC_SPECIFIC_AUTHORS = CMPC_AUTHOR_DESCRIPTIONS.filter(
  (a) => a.category === 'CMPC_SPECIFIC',
).map((a) => a.author);

export const TRADITIONAL_AUTHORS = Object.values(Author).filter(
  (author) => !CMPC_SPECIFIC_AUTHORS.includes(author),
);
