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
var AuditLogController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const audit_log_service_1 = require("../services/audit-log.service");
const audit_log_entity_1 = require("../entities/audit-log.entity");
let AuditLogController = AuditLogController_1 = class AuditLogController {
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
        this.logger = new common_1.Logger(AuditLogController_1.name);
    }
    async findAll(queryDto) {
        try {
            this.logger.log(`Fetching audit logs with query: ${JSON.stringify(queryDto)}`);
            const result = await this.auditLogService.findAll(queryDto);
            return {
                status: 'success',
                data: result,
                message: 'Audit logs retrieved successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error fetching audit logs: ${error.message}`);
            throw error;
        }
    }
    async getStats() {
        try {
            this.logger.log('Fetching audit log statistics');
            const stats = await this.auditLogService.getStats();
            return {
                status: 'success',
                data: stats,
                message: 'Audit log statistics retrieved successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error fetching audit log stats: ${error.message}`);
            throw error;
        }
    }
    async getActions() {
        try {
            this.logger.log('Fetching available audit log actions');
            return {
                status: 'success',
                data: {
                    actions: Object.values(audit_log_entity_1.AuditLogAction),
                    statuses: Object.values(audit_log_entity_1.AuditLogStatus),
                    levels: Object.values(audit_log_entity_1.AuditLogLevel),
                },
                message: 'Audit log actions retrieved successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error fetching audit log actions: ${error.message}`);
            throw error;
        }
    }
    async exportToCSV(queryDto, res) {
        try {
            this.logger.log(`Exporting audit logs to CSV with query: ${JSON.stringify(queryDto)}`);
            const csv = await this.auditLogService.exportToCSV(queryDto);
            const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.status(common_1.HttpStatus.OK).send(csv);
        }
        catch (error) {
            this.logger.error(`Error exporting audit logs: ${error.message}`);
            throw error;
        }
    }
    async exportInventoryToCSV(queryDto, res) {
        try {
            this.logger.log(`Exporting inventory audit logs to CSV with query: ${JSON.stringify(queryDto)}`);
            const csv = await this.auditLogService.exportInventoryToCSV(queryDto);
            const filename = `inventory-logs-${new Date().toISOString().split('T')[0]}.csv`;
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.status(common_1.HttpStatus.OK).send(csv);
        }
        catch (error) {
            this.logger.error(`Error exporting inventory audit logs: ${error.message}`);
            throw error;
        }
    }
    async getInventoryLogs(queryDto) {
        try {
            this.logger.debug(`Getting inventory logs with query: ${JSON.stringify(queryDto)}`);
            const inventoryQuery = Object.assign(Object.assign({}, queryDto), { entity_type: 'Book', action: queryDto.action || undefined });
            const result = await this.auditLogService.findAll(inventoryQuery);
            this.logger.debug(`Inventory logs result: ${result.logs.length} logs, total=${result.total}`);
            return {
                status: 'success',
                data: result,
                message: 'Inventory audit logs retrieved successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error getting inventory logs: ${error.message}`);
            throw error;
        }
    }
    async getInventoryFilterOptions() {
        try {
            this.logger.debug('Getting inventory filter options');
            const result = await this.auditLogService.getInventoryFilterOptions();
            return {
                status: 'success',
                data: result,
                message: 'Filter options retrieved successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error getting inventory filter options: ${error.message}`);
            throw error;
        }
    }
    async deleteAllLogs() {
        try {
            this.logger.debug('Deleting all audit logs');
            const deletedCount = await this.auditLogService.deleteAllLogs();
            this.logger.debug(`Deleted ${deletedCount} audit logs`);
            return {
                status: 'success',
                data: deletedCount,
                message: 'All audit logs deleted successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error deleting all audit logs: ${error.message}`);
            throw error;
        }
    }
    async updateMetadata() {
        try {
            this.logger.debug('Updating metadata for existing audit logs');
            const updatedCount = await this.auditLogService.updateMetadataForExistingLogs();
            this.logger.debug(`Updated metadata for ${updatedCount} audit logs`);
            return {
                status: 'success',
                data: updatedCount,
                message: 'Metadata updated successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error updating metadata: ${error.message}`);
            throw error;
        }
    }
    async cleanupOldLogs(days = '90') {
        try {
            const daysToKeep = parseInt(days, 10);
            this.logger.log(`Cleaning up audit logs older than ${daysToKeep} days`);
            const deletedCount = await this.auditLogService.cleanupOldLogs(daysToKeep);
            return {
                status: 'success',
                data: { deletedCount },
                message: `Successfully cleaned up ${deletedCount} old audit logs`,
            };
        }
        catch (error) {
            this.logger.error(`Error cleaning up audit logs: ${error.message}`);
            throw error;
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all audit logs with filtering and pagination',
        description: 'Retrieve audit logs with optional filtering by date, user, action, and pagination. Requires ADMIN or LIBRARIAN role.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Audit logs retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'object',
                    properties: {
                        logs: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/AuditLog' },
                        },
                        total: { type: 'number', example: 104 },
                        page: { type: 'string', example: '1' },
                        limit: { type: 'string', example: '20' },
                        totalPages: { type: 'number', example: 6 },
                    },
                },
                message: {
                    type: 'string',
                    example: 'Audit logs retrieved successfully',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid query parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of records per page',
        example: 20,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search term for filtering logs',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'action',
        required: false,
        description: 'Filter by specific action (CREATE, READ, UPDATE, DELETE, etc.)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'entity_type',
        required: false,
        description: 'Filter by entity type (Book, User, etc.)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter by status (SUCCESS, FAILURE, PENDING)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'level',
        required: false,
        description: 'Filter by log level (INFO, WARNING, ERROR, DEBUG)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'start_date',
        required: false,
        description: 'Start date for date range filter (ISO format)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'end_date',
        required: false,
        description: 'End date for date range filter (ISO format)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'author',
        required: false,
        description: 'Filter by book author (searches in metadata)',
        example: 'Gabriel García Márquez',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'publisher',
        required: false,
        description: 'Filter by book publisher (searches in metadata)',
        example: 'Editorial Planeta',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'genre',
        required: false,
        description: 'Filter by book genre (searches in metadata)',
        example: 'Ficción',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get audit log statistics',
        description: 'Retrieve comprehensive statistics about audit logs including counts by action, status, level, and recent activity. Requires ADMIN or LIBRARIAN role.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Audit log statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'object',
                    properties: {
                        totalLogs: { type: 'number', example: 104 },
                        logsByAction: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    action: { type: 'string', example: 'READ' },
                                    count: { type: 'number', example: 45 },
                                },
                            },
                        },
                        logsByStatus: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'SUCCESS' },
                                    count: { type: 'number', example: 98 },
                                },
                            },
                        },
                        logsByLevel: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    level: { type: 'string', example: 'INFO' },
                                    count: { type: 'number', example: 95 },
                                },
                            },
                        },
                        recentActivity: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/AuditLog' },
                        },
                    },
                },
                message: {
                    type: 'string',
                    example: 'Audit log statistics retrieved successfully',
                },
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
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('actions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available audit log actions, statuses, and levels',
        description: 'Retrieve all available values for audit log actions, statuses, and levels. Useful for building filter interfaces. Requires ADMIN or LIBRARIAN role.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Audit log actions retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'object',
                    properties: {
                        actions: {
                            type: 'array',
                            items: { type: 'string' },
                            example: [
                                'CREATE',
                                'READ',
                                'UPDATE',
                                'DELETE',
                                'LOGIN',
                                'LOGOUT',
                                'EXPORT',
                            ],
                        },
                        statuses: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['SUCCESS', 'FAILURE', 'PENDING'],
                        },
                        levels: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['INFO', 'WARNING', 'ERROR', 'DEBUG'],
                        },
                    },
                },
                message: {
                    type: 'string',
                    example: 'Audit log actions retrieved successfully',
                },
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
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getActions", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({
        summary: 'Export audit logs to CSV format',
        description: 'Export filtered audit logs to CSV format for external analysis. Supports all query parameters for filtering. Requires ADMIN role.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'CSV file exported successfully',
        headers: {
            'Content-Type': { description: 'text/csv' },
            'Content-Disposition': {
                description: 'attachment; filename="audit-logs-YYYY-MM-DD.csv"',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid query parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of records per page',
        example: 20,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search term for filtering logs',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'action',
        required: false,
        description: 'Filter by specific action',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'entity_type',
        required: false,
        description: 'Filter by entity type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter by status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'level',
        required: false,
        description: 'Filter by log level',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'start_date',
        required: false,
        description: 'Start date for date range filter',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'end_date',
        required: false,
        description: 'End date for date range filter',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "exportToCSV", null);
__decorate([
    (0, common_1.Get)('inventory/export'),
    (0, swagger_1.ApiOperation)({
        summary: 'Export inventory audit logs to CSV format',
        description: 'Export book inventory audit logs to CSV format with relevant book data. Includes only INVENTORY_ADDED, INVENTORY_UPDATED, INVENTORY_REMOVED, INVENTORY_VIEWED, and INVENTORY_SEARCHED actions.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'CSV file exported successfully',
        headers: {
            'Content-Type': { description: 'text/csv' },
            'Content-Disposition': {
                description: 'attachment; filename="inventory-logs-YYYY-MM-DD.csv"',
            },
        },
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search term for filtering logs',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'action',
        required: false,
        description: 'Filter by specific inventory action',
        enum: [
            'INVENTORY_ADDED',
            'INVENTORY_UPDATED',
            'INVENTORY_REMOVED',
            'INVENTORY_VIEWED',
            'INVENTORY_SEARCHED',
        ],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'author',
        required: false,
        description: 'Filter by book author',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'publisher',
        required: false,
        description: 'Filter by book publisher',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'genre',
        required: false,
        description: 'Filter by book genre',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'start_date',
        required: false,
        description: 'Start date for date range filter',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'end_date',
        required: false,
        description: 'End date for date range filter',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "exportInventoryToCSV", null);
__decorate([
    (0, common_1.Get)('inventory'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get inventory-related audit logs only',
        description: 'Retrieve only audit logs related to book inventory, excluding errors and authentication logs. Shows only successful inventory operations.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inventory audit logs retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'object',
                    properties: {
                        logs: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/AuditLog' },
                        },
                        total: { type: 'number', example: 25 },
                        page: { type: 'string', example: '1' },
                        limit: { type: 'string', example: '20' },
                        totalPages: { type: 'number', example: 2 },
                    },
                },
                message: {
                    type: 'string',
                    example: 'Inventory audit logs retrieved successfully',
                },
            },
        },
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of records per page',
        example: 20,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search term for filtering logs',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'action',
        required: false,
        description: 'Filter by specific action',
        enum: [
            'INVENTORY_ADDED',
            'INVENTORY_UPDATED',
            'INVENTORY_REMOVED',
            'INVENTORY_VIEWED',
            'INVENTORY_SEARCHED',
        ],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter by status',
        enum: ['SUCCESS', 'FAILURE', 'PENDING'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'start_date',
        required: false,
        description: 'Start date for filtering (ISO 8601 format)',
        example: '2024-01-01T00:00:00.000Z',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'end_date',
        required: false,
        description: 'End date for filtering (ISO 8601 format)',
        example: '2024-12-31T23:59:59.999Z',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sort_by',
        required: false,
        description: 'Field to sort by',
        enum: ['created_at', 'action', 'user_name', 'entity_type'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sort_dir',
        required: false,
        description: 'Sort direction',
        enum: ['ASC', 'DESC'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'author',
        required: false,
        description: 'Filter by book author (searches in metadata)',
        example: 'Gabriel García Márquez',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'publisher',
        required: false,
        description: 'Filter by book publisher (searches in metadata)',
        example: 'Editorial Planeta',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'genre',
        required: false,
        description: 'Filter by book genre (searches in metadata)',
        example: 'Ficción',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid query parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getInventoryLogs", null);
__decorate([
    (0, common_1.Get)('inventory/filter-options'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available filter options for inventory logs',
        description: 'Retrieve unique genres, publishers, and authors from books table for filter dropdowns',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Filter options retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'object',
                    properties: {
                        genres: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['Ficción', 'No Ficción', 'Ciencia Ficción'],
                        },
                        publishers: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['Editorial Planeta', 'Santillana', 'Alfaguara'],
                        },
                        authors: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['Gabriel García Márquez', 'Mario Vargas Llosa'],
                        },
                    },
                },
                message: { type: 'string', example: 'Filter options retrieved successfully' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getInventoryFilterOptions", null);
__decorate([
    (0, common_1.Delete)('delete-all'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete all audit logs',
        description: 'Permanently delete all audit logs from the system. This is an irreversible operation. Requires ADMIN role.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All audit logs deleted successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'number',
                    example: 150,
                    description: 'Number of logs deleted',
                },
                message: {
                    type: 'string',
                    example: 'All audit logs deleted successfully',
                },
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
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "deleteAllLogs", null);
__decorate([
    (0, common_1.Get)('update-metadata'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update metadata for existing audit logs',
        description: "Update metadata for existing audit logs that don't have book information.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Metadata updated successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'number',
                    example: 25,
                    description: 'Number of logs updated',
                },
                message: { type: 'string', example: 'Metadata updated successfully' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "updateMetadata", null);
__decorate([
    (0, common_1.Get)('cleanup'),
    (0, swagger_1.ApiOperation)({
        summary: 'Clean up old audit logs',
        description: 'Remove audit logs older than specified number of days. This is a permanent deletion operation. Requires ADMIN role.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Old audit logs cleaned up successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'object',
                    properties: {
                        deletedCount: {
                            type: 'number',
                            example: 45,
                            description: 'Number of logs deleted',
                        },
                    },
                },
                message: {
                    type: 'string',
                    example: 'Successfully cleaned up 45 old audit logs',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid days parameter',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        description: 'Number of days to keep logs (default: 90)',
        example: 90,
    }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "cleanupOldLogs", null);
AuditLogController = AuditLogController_1 = __decorate([
    (0, swagger_1.ApiTags)('audit-logs'),
    (0, common_1.Controller)('audit-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogController);
exports.AuditLogController = AuditLogController;
//# sourceMappingURL=audit-log.controller.js.map