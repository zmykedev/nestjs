"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRADITIONAL_AUTHORS = exports.CMPC_SPECIFIC_AUTHORS = exports.CMPC_AUTHOR_DESCRIPTIONS = void 0;
const author_enum_1 = require("../enums/author.enum");
exports.CMPC_AUTHOR_DESCRIPTIONS = [
    {
        author: author_enum_1.Author.LUIS_MATTE_LARRAIN,
        description: 'Fundador de CMPC, cuyas obras o biografía pueden ofrecer una visión sobre los inicios de la empresa.',
        category: 'CMPC_SPECIFIC',
    },
    {
        author: author_enum_1.Author.EXPERTOS_INGENIERIA_FORESTAL,
        description: 'Autores que hayan trabajado en la investigación y desarrollo de técnicas en la industria forestal.',
        category: 'CMPC_SPECIFIC',
    },
    {
        author: author_enum_1.Author.ECONOMISTAS_AMBIENTALES,
        description: 'Especialistas que analicen la intersección entre economía y medio ambiente en la industria.',
        category: 'CMPC_SPECIFIC',
    },
    {
        author: author_enum_1.Author.HISTORIADORES_INDUSTRIALES_CHILENOS,
        description: 'Investigadores que hayan documentado la historia industrial de Chile y empresas como CMPC.',
        category: 'CMPC_SPECIFIC',
    },
    {
        author: author_enum_1.Author.LIDERES_CMPC,
        description: 'Publicaciones de ejecutivos actuales o pasados de CMPC que compartan su visión y experiencias.',
        category: 'CMPC_SPECIFIC',
    },
    {
        author: author_enum_1.Author.INVESTIGADORES_SOSTENIBILIDAD,
        description: 'Académicos que se centren en prácticas sostenibles en la industria forestal y papelera.',
        category: 'CMPC_SPECIFIC',
    },
    {
        author: author_enum_1.Author.SOCIOLOGOS_ORGANIZACIONALES,
        description: 'Expertos que estudien la cultura corporativa y dinámica organizacional en grandes empresas.',
        category: 'CMPC_SPECIFIC',
    },
    {
        author: author_enum_1.Author.ESPECIALISTAS_INNOVACION_TECNOLOGICA,
        description: 'Autores que investiguen la aplicación de nuevas tecnologías en la industria del papel y la celulosa.',
        category: 'CMPC_SPECIFIC',
    },
    {
        author: author_enum_1.Author.ACTIVISTAS_AMBIENTALES,
        description: 'Personas que hayan trabajado en la promoción de la sostenibilidad y conservación en las áreas de operación de CMPC.',
        category: 'CMPC_SPECIFIC',
    },
    {
        author: author_enum_1.Author.EDUCADORES_TECNICOS,
        description: 'Profesionales que hayan contribuido a la formación técnica en áreas relacionadas con la industria.',
        category: 'CMPC_SPECIFIC',
    },
];
exports.CMPC_SPECIFIC_AUTHORS = exports.CMPC_AUTHOR_DESCRIPTIONS.filter((a) => a.category === 'CMPC_SPECIFIC').map((a) => a.author);
exports.TRADITIONAL_AUTHORS = Object.values(author_enum_1.Author).filter((author) => !exports.CMPC_SPECIFIC_AUTHORS.includes(author));
//# sourceMappingURL=cmpc-authors.js.map