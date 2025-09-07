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
exports.BooksController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const fs = require("fs");
const path = require("path");
const os = require("os");
const books_service_1 = require("./books.service");
const create_book_dto_1 = require("./dto/create-book.dto");
const update_book_dto_1 = require("./dto/update-book.dto");
const search_books_dto_1 = require("./dto/search-books.dto");
const book_entity_1 = require("./entities/book.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const storage_service_1 = require("../storage/services/storage.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let BooksController = class BooksController {
    constructor(booksService, storageService) {
        this.booksService = booksService;
        this.storageService = storageService;
    }
    testEndpoint() {
        return {
            message: 'Test endpoint working - no auth required',
            timestamp: new Date().toISOString(),
        };
    }
    create(createBookDto) {
        return this.booksService.create(createBookDto);
    }
    searchBooks(searchDto) {
        const result = this.booksService.findAll(searchDto.query);
        return result;
    }
    findAll() {
        return this.booksService.findAll({});
    }
    getGenres() {
        return this.booksService.getGenres();
    }
    getCmpcSpecificGenres() {
        return this.booksService.getCmpcSpecificGenres();
    }
    getTraditionalGenres() {
        return this.booksService.getTraditionalGenres();
    }
    getGenreDescriptions() {
        return this.booksService.getGenreDescriptions();
    }
    getAuthors() {
        return this.booksService.getAuthors();
    }
    getCmpcSpecificAuthors() {
        return this.booksService.getCmpcSpecificAuthors();
    }
    getTraditionalAuthors() {
        return this.booksService.getTraditionalAuthors();
    }
    getAuthorDescriptions() {
        return this.booksService.getAuthorDescriptions();
    }
    getPublishers() {
        return this.booksService.getPublishers();
    }
    async uploadBookImage(file, bookId, id, queryBookId) {
        const finalBookId = bookId || id || queryBookId;
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!finalBookId) {
            throw new common_1.BadRequestException('Book ID is required. Send it as bookId, id in body, or bookId as query parameter');
        }
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, file.originalname);
        try {
            fs.writeFileSync(tempFilePath, file.buffer);
            const result = (await this.storageService.uploadFileGcp(tempFilePath));
            fs.unlinkSync(tempFilePath);
            const imageUrl = result[0].metadata.mediaLink;
            const updatedBook = await this.booksService.update(finalBookId, {
                imageUrl,
            });
            const response = {
                success: true,
                message: 'Image uploaded and book updated successfully',
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
            };
            return response;
        }
        catch (error) {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            throw error;
        }
    }
    async exportToCSV(res) {
        try {
            const csv = await this.booksService.exportToCSV();
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=books.csv');
            res.status(common_1.HttpStatus.OK).send(csv);
        }
        catch (_a) {
            res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ message: 'Error exporting to CSV' });
        }
    }
    findOne(id) {
        return this.booksService.findOne(id);
    }
    update(id, updateBookDto) {
        return this.booksService.update(id, updateBookDto);
    }
    remove(id) {
        return this.booksService.remove(id);
    }
};
__decorate([
    (0, common_1.Get)('test'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Test endpoint - no authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test successful' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "testEndpoint", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new book' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Book created successfully',
        type: book_entity_1.Book,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_dto_1.CreateBookDto]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('search'),
    (0, swagger_1.ApiOperation)({
        summary: 'Search books with advanced filtering, sorting and pagination',
        description: 'Search books using multiple criteria including title, author, genre, price range, availability, and more. Supports sorting and pagination for large result sets.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Books retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'object',
                    properties: {
                        books: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Book' },
                        },
                        total: { type: 'number', example: 150 },
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 20 },
                        totalPages: { type: 'number', example: 8 },
                    },
                },
                message: { type: 'string', example: 'Books retrieved successfully' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid search parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_books_dto_1.SearchBooksDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "searchBooks", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all books (simple list without filters)',
        description: 'Retrieve a simple list of all books in the system without advanced filtering. Useful for basic browsing and simple applications.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Books retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Book' },
                },
                message: { type: 'string', example: 'Books retrieved successfully' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('genres'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available genres' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Genres retrieved successfully',
        type: [String],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BooksController.prototype, "getGenres", null);
__decorate([
    (0, common_1.Get)('genres/cmpc-specific'),
    (0, swagger_1.ApiOperation)({ summary: 'Get CMPC specific genres' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'CMPC specific genres retrieved successfully',
        type: [String],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BooksController.prototype, "getCmpcSpecificGenres", null);
__decorate([
    (0, common_1.Get)('genres/traditional'),
    (0, swagger_1.ApiOperation)({ summary: 'Get traditional genres' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Traditional genres retrieved successfully',
        type: [String],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BooksController.prototype, "getTraditionalGenres", null);
__decorate([
    (0, common_1.Get)('genres/descriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get genres with descriptions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Genres with descriptions retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getGenreDescriptions", null);
__decorate([
    (0, common_1.Get)('authors'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available authors' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Authors retrieved successfully',
        type: [String],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BooksController.prototype, "getAuthors", null);
__decorate([
    (0, common_1.Get)('authors/cmpc-specific'),
    (0, swagger_1.ApiOperation)({ summary: 'Get CMPC specific authors' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'CMPC specific authors retrieved successfully',
        type: [String],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BooksController.prototype, "getCmpcSpecificAuthors", null);
__decorate([
    (0, common_1.Get)('authors/traditional'),
    (0, swagger_1.ApiOperation)({ summary: 'Get traditional authors' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Traditional authors retrieved successfully',
        type: [String],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BooksController.prototype, "getTraditionalAuthors", null);
__decorate([
    (0, common_1.Get)('authors/descriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get authors with descriptions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Authors with descriptions retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getAuthorDescriptions", null);
__decorate([
    (0, common_1.Get)('publishers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available publishers' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Publishers retrieved successfully',
        type: [String],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BooksController.prototype, "getPublishers", null);
__decorate([
    (0, common_1.Post)('upload-image'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload an image for a book' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Image uploaded and book updated successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: {
                            type: 'string',
                            example: 'Image uploaded and book updated successfully',
                        },
                        originalName: { type: 'string', example: 'book-cover.jpg' },
                        size: { type: 'number', example: 1024000 },
                        mimeType: { type: 'string', example: 'image/jpeg' },
                    },
                },
                message: { type: 'string', example: 'Registro creado exitosamente' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                path: { type: 'string', example: '/api/v1/books/upload-image' },
                method: { type: 'string', example: 'POST' },
                statusCode: { type: 'number', example: 201 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid file or file too large',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book not found' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('bookId')),
    __param(2, (0, common_1.Body)('id')),
    __param(3, (0, common_1.Query)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "uploadBookImage", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, swagger_1.ApiOperation)({ summary: 'Export all books to CSV format' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV exported successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "exportToCSV", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a book by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Book retrieved successfully',
        type: book_entity_1.Book,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a book' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Book updated successfully',
        type: book_entity_1.Book,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_book_dto_1.UpdateBookDto]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a book' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "remove", null);
BooksController = __decorate([
    (0, swagger_1.ApiTags)('books'),
    (0, common_1.Controller)('books'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [books_service_1.BooksService,
        storage_service_1.StorageService])
], BooksController);
exports.BooksController = BooksController;
//# sourceMappingURL=books.controller.js.map