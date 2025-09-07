"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRADITIONAL_GENRES = exports.CMPC_SPECIFIC_GENRES = exports.CMPC_GENRE_DESCRIPTIONS = void 0;
const genre_enum_1 = require("../enums/genre.enum");
exports.CMPC_GENRE_DESCRIPTIONS = [
    {
        genre: genre_enum_1.Genre.HISTORIA_INDUSTRIAL_CHILE,
        description: 'Libros que aborden el desarrollo industrial en Chile, con énfasis en la industria forestal y papelera.',
        category: 'CMPC_SPECIFIC',
    },
    {
        genre: genre_enum_1.Genre.TECNOLOGIA_PROCESOS_INDUSTRIALES,
        description: 'Publicaciones sobre las tecnologías utilizadas en la producción de celulosa, papel y productos derivados.',
        category: 'CMPC_SPECIFIC',
    },
    {
        genre: genre_enum_1.Genre.SOSTENIBILIDAD_MEDIO_AMBIENTE,
        description: 'Obras que traten sobre prácticas sostenibles en la industria forestal y la gestión ambiental.',
        category: 'CMPC_SPECIFIC',
    },
    {
        genre: genre_enum_1.Genre.ECONOMIA_FORESTAL,
        description: 'Libros que analicen la economía de la industria forestal, incluyendo mercados, comercio y políticas públicas.',
        category: 'CMPC_SPECIFIC',
    },
    {
        genre: genre_enum_1.Genre.CULTURA_CORPORATIVA_LIDERAZGO,
        description: 'Publicaciones que exploren la cultura organizacional, liderazgo y gestión en empresas industriales.',
        category: 'CMPC_SPECIFIC',
    },
    {
        genre: genre_enum_1.Genre.INNOVACION_DESARROLLO_TECNOLOGICO,
        description: 'Obras que discutan avances tecnológicos y su aplicación en la industria del papel y la celulosa.',
        category: 'CMPC_SPECIFIC',
    },
    {
        genre: genre_enum_1.Genre.RESPONSABILIDAD_SOCIAL_EMPRESARIAL,
        description: 'Libros que aborden cómo las empresas gestionan su impacto social y comunitario.',
        category: 'CMPC_SPECIFIC',
    },
    {
        genre: genre_enum_1.Genre.HISTORIA_EMPRESAS_CHILENAS,
        description: 'Publicaciones que narren la evolución de empresas chilenas destacadas, incluyendo CMPC.',
        category: 'CMPC_SPECIFIC',
    },
    {
        genre: genre_enum_1.Genre.BIODIVERSIDAD_CONSERVACION,
        description: 'Obras que traten sobre la biodiversidad en las zonas donde CMPC opera y sus esfuerzos de conservación.',
        category: 'CMPC_SPECIFIC',
    },
    {
        genre: genre_enum_1.Genre.EDUCACION_FORMACION_TECNICA,
        description: 'Libros que aborden la formación técnica en áreas relacionadas con la industria forestal y papelera.',
        category: 'CMPC_SPECIFIC',
    },
];
exports.CMPC_SPECIFIC_GENRES = exports.CMPC_GENRE_DESCRIPTIONS.filter((g) => g.category === 'CMPC_SPECIFIC').map((g) => g.genre);
exports.TRADITIONAL_GENRES = Object.values(genre_enum_1.Genre).filter((genre) => !exports.CMPC_SPECIFIC_GENRES.includes(genre));
//# sourceMappingURL=cmpc-genres.js.map