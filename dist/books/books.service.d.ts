import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
export interface BookListResponse {
    books: Book[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class BooksService {
    private readonly bookRepository;
    constructor(bookRepository: Repository<Book>);
    create(createBookDto: CreateBookDto): Promise<Book>;
    findAll(queryDto: QueryBookDto): Promise<BookListResponse>;
    findOne(id: string): Promise<Book>;
    update(id: string, updateBookDto: UpdateBookDto): Promise<Book>;
    remove(id: string): Promise<void>;
    getGenres(): string[];
    getCmpcSpecificGenres(): string[];
    getTraditionalGenres(): string[];
    getGenreDescriptions(): import("./constants/cmpc-genres").GenreDescription[];
    getAuthors(): string[];
    getCmpcSpecificAuthors(): string[];
    getTraditionalAuthors(): string[];
    getAuthorDescriptions(): import("./constants/cmpc-authors").AuthorDescription[];
    getPublishers(): string[];
    exportToCSV(): Promise<string>;
}
