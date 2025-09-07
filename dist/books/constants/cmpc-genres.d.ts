import { Genre } from '../enums/genre.enum';
export interface GenreDescription {
    genre: Genre;
    description: string;
    category: 'CMPC_SPECIFIC' | 'TRADITIONAL';
}
export declare const CMPC_GENRE_DESCRIPTIONS: GenreDescription[];
export declare const CMPC_SPECIFIC_GENRES: Genre[];
export declare const TRADITIONAL_GENRES: Genre[];
