import { Author } from '../enums/author.enum';
export interface AuthorDescription {
    author: Author;
    description: string;
    category: 'CMPC_SPECIFIC' | 'TRADITIONAL';
}
export declare const CMPC_AUTHOR_DESCRIPTIONS: AuthorDescription[];
export declare const CMPC_SPECIFIC_AUTHORS: Author[];
export declare const TRADITIONAL_AUTHORS: Author[];
