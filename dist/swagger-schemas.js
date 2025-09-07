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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseSchema = exports.ApiResponseSchema = exports.PaginationSchema = exports.UserSchema = exports.BookSchema = exports.AuditLogSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class AuditLogSchema {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del log de auditoría',
        example: 104,
    }),
    __metadata("design:type", Number)
], AuditLogSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado activo del registro',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AuditLogSchema.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del log',
        example: '2025-09-04T22:24:18.373Z',
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización',
        example: '2025-09-04T22:24:18.373Z',
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de eliminación (soft delete)',
        example: null,
        nullable: true,
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario que realizó la acción',
        example: '12',
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del usuario',
        example: 'admin@cmpc.com',
        nullable: true,
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "user_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del usuario',
        example: 'Administrador',
        nullable: true,
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "user_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Acción realizada',
        example: 'READ',
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT'],
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de entidad afectada',
        example: 'Book',
        nullable: true,
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "entity_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la entidad afectada',
        example: '45',
        nullable: true,
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "entity_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción de la acción realizada',
        example: 'Consultar lista de libros',
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Datos de la petición HTTP',
        example: {
            url: '/api/v1/books',
            method: 'GET',
            headers: { authorization: '[REDACTED]' },
        },
    }),
    __metadata("design:type", Object)
], AuditLogSchema.prototype, "request_data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Datos de la respuesta HTTP',
        example: {
            status: 'success',
            message: 'Books retrieved successfully',
        },
    }),
    __metadata("design:type", Object)
], AuditLogSchema.prototype, "response_data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la operación',
        example: 'SUCCESS',
        enum: ['SUCCESS', 'FAILURE', 'PENDING'],
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nivel del log',
        example: 'INFO',
        enum: ['INFO', 'WARNING', 'ERROR', 'DEBUG'],
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección IP del usuario',
        example: '::1',
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "ip_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User-Agent del navegador',
        example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "user_agent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Endpoint de la API llamado',
        example: '/api/v1/books',
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "endpoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Método HTTP utilizado',
        example: 'GET',
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "http_method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tiempo de respuesta en milisegundos',
        example: 27,
    }),
    __metadata("design:type", Number)
], AuditLogSchema.prototype, "response_time_ms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mensaje de error si la operación falló',
        example: null,
        nullable: true,
    }),
    __metadata("design:type", String)
], AuditLogSchema.prototype, "error_message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Metadatos adicionales de la operación',
        example: { sessionId: 'abc123', correlationId: 'def456' },
        nullable: true,
    }),
    __metadata("design:type", Object)
], AuditLogSchema.prototype, "metadata", void 0);
exports.AuditLogSchema = AuditLogSchema;
class BookSchema {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del libro',
        example: 1,
    }),
    __metadata("design:type", Number)
], BookSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Título del libro',
        example: 'El Quijote',
        minLength: 2,
        maxLength: 255,
    }),
    __metadata("design:type", String)
], BookSchema.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Autor del libro',
        example: 'Miguel de Cervantes',
        minLength: 2,
        maxLength: 255,
    }),
    __metadata("design:type", String)
], BookSchema.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Editorial del libro',
        example: 'Editorial Planeta',
        minLength: 2,
        maxLength: 255,
    }),
    __metadata("design:type", String)
], BookSchema.prototype, "publisher", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio del libro',
        example: 25.99,
        minimum: 0,
        maximum: 1000000,
    }),
    __metadata("design:type", Number)
], BookSchema.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Disponibilidad del libro',
        example: true,
    }),
    __metadata("design:type", Boolean)
], BookSchema.prototype, "availability", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Género literario',
        example: 'Ficción',
        minLength: 2,
        maxLength: 100,
    }),
    __metadata("design:type", String)
], BookSchema.prototype, "genre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de la imagen del libro',
        example: 'https://example.com/quijote.jpg',
        nullable: true,
    }),
    __metadata("design:type", String)
], BookSchema.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del libro',
        example: 'Obra maestra de la literatura universal',
        nullable: true,
    }),
    __metadata("design:type", String)
], BookSchema.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock disponible',
        example: 15,
        minimum: 0,
        default: 0,
    }),
    __metadata("design:type", Number)
], BookSchema.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado activo del registro',
        example: true,
    }),
    __metadata("design:type", Boolean)
], BookSchema.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], BookSchema.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", String)
], BookSchema.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de eliminación (soft delete)',
        example: null,
        nullable: true,
    }),
    __metadata("design:type", String)
], BookSchema.prototype, "deleted_at", void 0);
exports.BookSchema = BookSchema;
class UserSchema {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del usuario',
        example: 1,
    }),
    __metadata("design:type", Number)
], UserSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del usuario (debe ser único)',
        example: 'admin@cmpc.com',
        format: 'email',
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del usuario',
        example: 'Juan',
        minLength: 2,
        maxLength: 100,
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Apellido del usuario',
        example: 'Pérez',
        minLength: 2,
        maxLength: 100,
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario en el sistema',
        example: 'ADMIN',
        enum: ['ADMIN', 'LIBRARIAN', 'USER'],
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado activo del usuario',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UserSchema.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de último login',
        example: '2024-01-15T10:30:00Z',
        nullable: true,
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "last_login", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de eliminación (soft delete)',
        example: null,
        nullable: true,
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "deleted_at", void 0);
exports.UserSchema = UserSchema;
class PaginationSchema {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número total de registros',
        example: 150,
    }),
    __metadata("design:type", Number)
], PaginationSchema.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Página actual',
        example: 1,
    }),
    __metadata("design:type", Number)
], PaginationSchema.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de registros por página',
        example: 20,
    }),
    __metadata("design:type", Number)
], PaginationSchema.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número total de páginas',
        example: 8,
    }),
    __metadata("design:type", Number)
], PaginationSchema.prototype, "totalPages", void 0);
exports.PaginationSchema = PaginationSchema;
class ApiResponseSchema {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la respuesta',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ApiResponseSchema.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Datos de la respuesta',
        type: 'object',
        additionalProperties: true,
    }),
    __metadata("design:type", Object)
], ApiResponseSchema.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mensaje descriptivo',
        example: 'Operación realizada exitosamente',
    }),
    __metadata("design:type", String)
], ApiResponseSchema.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp de la respuesta',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", String)
], ApiResponseSchema.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ruta del endpoint',
        example: '/api/v1/books',
    }),
    __metadata("design:type", String)
], ApiResponseSchema.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Método HTTP',
        example: 'GET',
    }),
    __metadata("design:type", String)
], ApiResponseSchema.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código de estado HTTP',
        example: 200,
    }),
    __metadata("design:type", Number)
], ApiResponseSchema.prototype, "statusCode", void 0);
exports.ApiResponseSchema = ApiResponseSchema;
class ErrorResponseSchema {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código de estado HTTP',
        example: 400,
    }),
    __metadata("design:type", Number)
], ErrorResponseSchema.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mensaje de error',
        example: 'Bad Request',
    }),
    __metadata("design:type", String)
], ErrorResponseSchema.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de error',
        example: 'Bad Request',
    }),
    __metadata("design:type", String)
], ErrorResponseSchema.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp del error',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", String)
], ErrorResponseSchema.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ruta del endpoint',
        example: '/api/v1/books',
    }),
    __metadata("design:type", String)
], ErrorResponseSchema.prototype, "path", void 0);
exports.ErrorResponseSchema = ErrorResponseSchema;
//# sourceMappingURL=swagger-schemas.js.map