"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("./entities/book.entity");
const query_book_dto_1 = require("./dto/query-book.dto");
const genre_enum_1 = require("./enums/genre.enum");
const author_enum_1 = require("./enums/author.enum");
const publisher_enum_1 = require("./enums/publisher.enum");
const cmpc_genres_1 = require("./constants/cmpc-genres");
const cmpc_authors_1 = require("./constants/cmpc-authors");
let BooksService = class BooksService {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async create(createBookDto) {
        try {
            const book = this.bookRepository.create(createBookDto);
            const savedBook = await this.bookRepository.save(book);
            return savedBook;
        }
        catch (_a) {
            throw new common_1.BadRequestException('Error creating book');
        }
    }
    async findAll(queryDto) {
        try {
            const { page = 1, limit = 10, search, genre, publisher, author, availability, sortBy = query_book_dto_1.SortField.TITLE, sortDir = query_book_dto_1.SortDirection.ASC, } = queryDto;
            const queryBuilder = this.bookRepository
                .createQueryBuilder('book')
                .where('book.deletedAt IS NULL');
            if (search) {
                queryBuilder.andWhere('book.title ILIKE :search', {
                    search: `%${search}%`,
                });
            }
            if (genre) {
                queryBuilder.andWhere('book.genre = :genre', { genre });
            }
            if (publisher) {
                queryBuilder.andWhere('book.publisher = :publisher', { publisher });
            }
            if (author) {
                queryBuilder.andWhere('book.author ILIKE :author', {
                    author: `%${author}%`,
                });
            }
            if (availability !== undefined) {
                queryBuilder.andWhere('book.availability = :availability', {
                    availability,
                });
            }
            const orderBy = `book.${sortBy}`;
            queryBuilder.orderBy(orderBy, sortDir.toUpperCase());
            const offset = (page - 1) * limit;
            queryBuilder.skip(offset).take(limit);
            const [books, total] = await queryBuilder.getManyAndCount();
            const totalPages = Math.ceil(total / limit);
            return {
                books,
                total,
                page,
                limit,
                totalPages,
            };
        }
        catch (_a) {
            throw new common_1.BadRequestException('Error finding books');
        }
    }
    async findOne(id) {
        try {
            const book = await this.bookRepository.findOne({
                where: { id, deletedAt: null },
            });
            if (!book) {
                throw new common_1.NotFoundException(`Book with ID ${id} not found`);
            }
            return book;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error finding book');
        }
    }
    async update(id, updateBookDto) {
        try {
            const book = await this.findOne(id);
            Object.assign(book, updateBookDto);
            const updatedBook = await this.bookRepository.save(book);
            return updatedBook;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error updating book');
        }
    }
    async remove(id) {
        try {
            await this.findOne(id);
            await this.bookRepository.softDelete(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error deleting book');
        }
    }
    getGenres() {
        return Object.values(genre_enum_1.Genre);
    }
    getCmpcSpecificGenres() {
        return cmpc_genres_1.CMPC_SPECIFIC_GENRES;
    }
    getTraditionalGenres() {
        return cmpc_genres_1.TRADITIONAL_GENRES;
    }
    getGenreDescriptions() {
        return cmpc_genres_1.CMPC_GENRE_DESCRIPTIONS;
    }
    getAuthors() {
        return Object.values(author_enum_1.Author);
    }
    getCmpcSpecificAuthors() {
        return cmpc_authors_1.CMPC_SPECIFIC_AUTHORS;
    }
    getTraditionalAuthors() {
        return cmpc_authors_1.TRADITIONAL_AUTHORS;
    }
    getAuthorDescriptions() {
        return cmpc_authors_1.CMPC_AUTHOR_DESCRIPTIONS;
    }
    getPublishers() {
        return Object.values(publisher_enum_1.Publisher);
    }
    async exportToCSV() {
        try {
            const books = await this.bookRepository.find({
                where: { deletedAt: null },
                order: { title: 'ASC' },
            });
            const csvHeaders = 'ID,Título,Autor,Editorial,Precio,Disponibilidad,Género,Stock,Creado\n';
            const csvRows = books
                .map((book) => `${book.id},"${book.title}","${book.author}","${book.publisher}",${book.price},${book.availability},"${book.genre}",${book.stock},${book.createdAt.toISOString()}`)
                .join('\n');
            const csv = csvHeaders + csvRows;
            return csv;
        }
        catch (_a) {
            throw new common_1.BadRequestException('Error exporting to CSV');
        }
    }
};
BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BooksService);
exports.BooksService = BooksService;
//# sourceMappingURL=books.service.js.map