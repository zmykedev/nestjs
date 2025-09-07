/// <reference types="multer" />
import { Response } from 'express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBooksDto } from './dto/search-books.dto';
import { Book } from './entities/book.entity';
import { StorageService } from '../storage/services/storage.service';
export declare class BooksController {
    private readonly booksService;
    private readonly storageService;
    constructor(booksService: BooksService, storageService: StorageService);
    testEndpoint(): {
        message: string;
        timestamp: string;
    };
    create(createBookDto: CreateBookDto): Promise<Book>;
    searchBooks(searchDto: SearchBooksDto): Promise<import("./books.service").BookListResponse>;
    findAll(): Promise<import("./books.service").BookListResponse>;
    getGenres(): string[];
    getCmpcSpecificGenres(): string[];
    getTraditionalGenres(): string[];
    getGenreDescriptions(): import("./constants/cmpc-genres").GenreDescription[];
    getAuthors(): string[];
    getCmpcSpecificAuthors(): string[];
    getTraditionalAuthors(): string[];
    getAuthorDescriptions(): import("./constants/cmpc-authors").AuthorDescription[];
    getPublishers(): string[];
    uploadBookImage(file: Express.Multer.File, bookId: string, id: string, queryBookId: string): Promise<{
        success: boolean;
        message: string;
        originalName: string;
        size: number;
        mimeType: string;
    }>;
    exportToCSV(res: Response): Promise<void>;
    findOne(id: string): Promise<Book>;
    update(id: string, updateBookDto: UpdateBookDto): Promise<Book>;
    remove(id: string): Promise<void>;
}
