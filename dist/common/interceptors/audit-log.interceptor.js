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
var AuditLogInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_log_service_1 = require("../services/audit-log.service");
const audit_log_entity_1 = require("../entities/audit-log.entity");
const books_service_1 = require("../../books/books.service");
let AuditLogInterceptor = AuditLogInterceptor_1 = class AuditLogInterceptor {
    constructor(auditLogService, booksService) {
        this.auditLogService = auditLogService;
        this.booksService = booksService;
        this.logger = new common_1.Logger(AuditLogInterceptor_1.name);
    }
    async intercept(context, next) {
        var _a, _b, _c, _d;
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const startTime = Date.now();
        const user = request.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.sub);
        const userEmail = user === null || user === void 0 ? void 0 : user.email;
        const userName = (user === null || user === void 0 ? void 0 : user.firstName)
            ? `${user.firstName} ${user.lastName || ''}`.trim()
            : user === null || user === void 0 ? void 0 : user.username;
        const action = this.determineAction(request.method, (_a = request.route) === null || _a === void 0 ? void 0 : _a.path);
        if (!action) {
            return next.handle();
        }
        const entityType = this.determineEntityType((_b = request.route) === null || _b === void 0 ? void 0 : _b.path);
        const entityId = this.extractEntityId(request.params, request.body);
        const metadata = await this.extractBookMetadata(request, entityType);
        const auditLogDto = {
            user_id: userId,
            user_email: userEmail,
            user_name: userName,
            action,
            entity_type: entityType,
            entity_id: entityId,
            description: this.generateDescription(request.method, (_c = request.route) === null || _c === void 0 ? void 0 : _c.path, entityType, request),
            request_data: this.sanitizeRequestData(request),
            ip_address: this.getClientIp(request),
            user_agent: request.get('User-Agent'),
            endpoint: ((_d = request.route) === null || _d === void 0 ? void 0 : _d.path) || request.url,
            http_method: request.method,
            level: audit_log_entity_1.AuditLogLevel.INFO,
            status: audit_log_entity_1.AuditLogStatus.PENDING,
            metadata: metadata,
        };
        return next.handle().pipe((0, operators_1.tap)((data) => {
            const responseTime = Date.now() - startTime;
            this.auditLogService.create(Object.assign(Object.assign({}, auditLogDto), { status: audit_log_entity_1.AuditLogStatus.SUCCESS, response_data: this.sanitizeResponseData(data), response_time_ms: responseTime }));
        }), (0, operators_1.catchError)((error) => {
            const responseTime = Date.now() - startTime;
            this.auditLogService.create(Object.assign(Object.assign({}, auditLogDto), { status: audit_log_entity_1.AuditLogStatus.FAILURE, level: audit_log_entity_1.AuditLogLevel.ERROR, error_message: error.message, response_time_ms: responseTime }));
            throw error;
        }));
    }
    determineAction(method, path) {
        if (!(path === null || path === void 0 ? void 0 : path.includes('books'))) {
            return null;
        }
        if ((path === null || path === void 0 ? void 0 : path.includes('/upload-image')) ||
            (path === null || path === void 0 ? void 0 : path.includes('/genres')) ||
            (path === null || path === void 0 ? void 0 : path.includes('/publishers')) ||
            (path === null || path === void 0 ? void 0 : path.includes('/test'))) {
            return null;
        }
        switch (method) {
            case 'GET':
                if (path === null || path === void 0 ? void 0 : path.includes('search')) {
                    return audit_log_entity_1.AuditLogAction.INVENTORY_SEARCHED;
                }
                return audit_log_entity_1.AuditLogAction.INVENTORY_VIEWED;
            case 'POST':
                if (path === '/api/v1/books' || (path === null || path === void 0 ? void 0 : path.endsWith('/books'))) {
                    return audit_log_entity_1.AuditLogAction.INVENTORY_ADDED;
                }
                if (path === null || path === void 0 ? void 0 : path.includes('search')) {
                    return audit_log_entity_1.AuditLogAction.INVENTORY_SEARCHED;
                }
                return null;
            case 'PUT':
            case 'PATCH':
                if ((path === null || path === void 0 ? void 0 : path.includes('/books/')) && (path === null || path === void 0 ? void 0 : path.includes('/'))) {
                    return audit_log_entity_1.AuditLogAction.INVENTORY_UPDATED;
                }
                return null;
            case 'DELETE':
                if ((path === null || path === void 0 ? void 0 : path.includes('/books/')) && (path === null || path === void 0 ? void 0 : path.includes('/'))) {
                    return audit_log_entity_1.AuditLogAction.INVENTORY_REMOVED;
                }
                return null;
            default:
                return null;
        }
    }
    determineEntityType(path) {
        if (!path)
            return 'unknown';
        if (path.includes('books'))
            return 'Book';
        if (path.includes('users'))
            return 'User';
        if (path.includes('auth'))
            return 'Auth';
        if (path.includes('dashboard'))
            return 'Dashboard';
        return 'unknown';
    }
    extractEntityId(params, body) {
        if (params === null || params === void 0 ? void 0 : params.id)
            return params.id;
        if (params === null || params === void 0 ? void 0 : params.bookId)
            return params.bookId;
        if (params === null || params === void 0 ? void 0 : params.userId)
            return params.userId;
        if (body === null || body === void 0 ? void 0 : body.id)
            return body.id;
        return undefined;
    }
    generateDescription(method, path, entityType, request) {
        if (entityType !== 'Book') {
            return 'Operación no relacionada con libros';
        }
        if (request === null || request === void 0 ? void 0 : request.body) {
            const body = request.body;
            if (method === 'POST' && body.title && body.author && body.publisher) {
                return `📚 Libro creado: "${body.title}" por ${body.author} en ${body.publisher}`;
            }
            if ((method === 'PUT' || method === 'PATCH') &&
                body.title &&
                body.author &&
                body.publisher) {
                return `✏️ Libro actualizado: "${body.title}" por ${body.author} en ${body.publisher}`;
            }
            if (method === 'DELETE' && body.title) {
                return `🗑️ Libro eliminado: "${body.title}"`;
            }
        }
        if (path === null || path === void 0 ? void 0 : path.includes('search')) {
            return '🔍 Búsqueda de libros realizada';
        }
        if (path === null || path === void 0 ? void 0 : path.includes('export')) {
            return '📤 Exportación de libros realizada';
        }
        if (path === null || path === void 0 ? void 0 : path.includes('import')) {
            return '📥 Importación de libros realizada';
        }
        if (path === null || path === void 0 ? void 0 : path.includes('filter')) {
            return '🔧 Filtrado de libros aplicado';
        }
        if (path === null || path === void 0 ? void 0 : path.includes('sort')) {
            return '📊 Ordenamiento de libros aplicado';
        }
        if ((path === null || path === void 0 ? void 0 : path.includes('page')) || (path === null || path === void 0 ? void 0 : path.includes('limit'))) {
            return '📄 Navegación por páginas de libros';
        }
        switch (method) {
            case 'GET':
                return '🔍 Visualización de libros';
            case 'POST':
                return '🆕 Creación de nuevo libro';
            case 'PUT':
            case 'PATCH':
                return '🔄 Actualización de libro';
            case 'DELETE':
                return '🗑️ Eliminación de libro';
            default:
                return '📚 Operación en libros';
        }
    }
    sanitizeRequestData(request) {
        const data = {
            method: request.method,
            url: request.url,
            headers: this.sanitizeHeaders(request.headers),
        };
        if (Object.keys(request.query).length > 0) {
            data.query = request.query;
        }
        if (Object.keys(request.params).length > 0) {
            data.params = request.params;
        }
        if (request.body && Object.keys(request.body).length > 0) {
            data.body = this.sanitizeBody(request.body);
        }
        return data;
    }
    sanitizeResponseData(data) {
        if (!data)
            return null;
        if (data.books && Array.isArray(data.books)) {
            return {
                total: data.total,
                page: data.page,
                limit: data.limit,
                totalPages: data.totalPages,
                itemsCount: data.books.length,
            };
        }
        if (Array.isArray(data)) {
            return {
                itemsCount: data.length,
                type: 'array',
            };
        }
        if (typeof data === 'object') {
            const sanitized = {};
            Object.keys(data).forEach((key) => {
                if (typeof data[key] !== 'function' &&
                    key !== 'password' &&
                    key !== 'token') {
                    if (typeof data[key] === 'object' && data[key] !== null) {
                        sanitized[key] = 'object';
                    }
                    else {
                        sanitized[key] = data[key];
                    }
                }
            });
            return sanitized;
        }
        return data;
    }
    sanitizeHeaders(headers) {
        const sanitized = {};
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
        Object.keys(headers).forEach((key) => {
            if (!sensitiveHeaders.includes(key.toLowerCase())) {
                sanitized[key] = headers[key];
            }
            else {
                sanitized[key] = '[REDACTED]';
            }
        });
        return sanitized;
    }
    sanitizeBody(body) {
        if (!body || typeof body !== 'object')
            return body;
        const sanitized = {};
        const sensitiveFields = ['password', 'token', 'refreshToken', 'apiKey'];
        Object.keys(body).forEach((key) => {
            if (sensitiveFields.includes(key.toLowerCase())) {
                sanitized[key] = '[REDACTED]';
            }
            else if (typeof body[key] === 'object' && body[key] !== null) {
                sanitized[key] = this.sanitizeBody(body[key]);
            }
            else {
                sanitized[key] = body[key];
            }
        });
        return sanitized;
    }
    getClientIp(request) {
        var _a, _b;
        return (request.headers['x-forwarded-for'] ||
            request.headers['x-real-ip'] ||
            ((_a = request.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress) ||
            ((_b = request.socket) === null || _b === void 0 ? void 0 : _b.remoteAddress) ||
            'unknown');
    }
    async extractBookMetadata(request, entityType) {
        var _a;
        this.logger.debug(`Extracting metadata for ${request === null || request === void 0 ? void 0 : request.method} ${request === null || request === void 0 ? void 0 : request.url}, entityType=${entityType}`);
        if (entityType !== 'Book') {
            this.logger.debug(`No metadata extracted: entityType=${entityType}`);
            return null;
        }
        if ((request === null || request === void 0 ? void 0 : request.method) === 'DELETE' && ((_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id)) {
            this.logger.debug(`DELETE operation detected, book ID: ${request.params.id}`);
            try {
                const book = await this.booksService.findOne(request.params.id);
                this.logger.debug(`Book found: ${book ? 'YES' : 'NO'}`);
                if (book) {
                    const metadata = {
                        title: book.title || null,
                        author: book.author || null,
                        publisher: book.publisher || null,
                        genre: book.genre || null,
                        stock: book.stock || null,
                        price: book.price || null,
                        description: book.description || null,
                    };
                    this.logger.debug(`Book metadata extracted from DB for DELETE: ${JSON.stringify(metadata)}`);
                    return metadata;
                }
                else {
                    this.logger.warn(`Book with ID ${request.params.id} not found in database`);
                }
            }
            catch (error) {
                this.logger.error(`Error fetching book data for DELETE operation: ${error.message}`);
                this.logger.error(`Error stack: ${error.stack}`);
            }
        }
        if ((request === null || request === void 0 ? void 0 : request.body) && Object.keys(request.body).length > 0) {
            const bookData = request.body;
            const metadata = {
                title: bookData.title || null,
                author: bookData.author || null,
                publisher: bookData.publisher || null,
                genre: bookData.genre || null,
                stock: bookData.stock || null,
                price: bookData.price || null,
                description: bookData.description || null,
            };
            this.logger.debug(`Book metadata extracted from body: ${JSON.stringify(metadata)}`);
            return metadata;
        }
        this.logger.debug(`No book data found for ${request === null || request === void 0 ? void 0 : request.method} operation`);
        return null;
    }
};
AuditLogInterceptor = AuditLogInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService,
        books_service_1.BooksService])
], AuditLogInterceptor);
exports.AuditLogInterceptor = AuditLogInterceptor;
//# sourceMappingURL=audit-log.interceptor.js.map