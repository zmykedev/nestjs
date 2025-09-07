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
exports.StorageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const storage_service_1 = require("../services/storage.service");
const response_interceptor_1 = require("../../common/interceptors/response.interceptor");
let StorageController = class StorageController {
    constructor(storageService) {
        this.storageService = storageService;
    }
    async uploadFileGcp(filePath) {
        if (!filePath) {
            throw new common_1.BadRequestException('File path is required');
        }
        const result = await this.storageService.uploadFileGcp(filePath);
        return {
            result,
            filePath,
        };
    }
};
__decorate([
    (0, common_1.Post)('upload-simple'),
    (0, swagger_1.ApiOperation)({ summary: 'Simple file upload to Google Cloud Storage' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'File uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                data: {
                    type: 'object',
                    properties: {
                        result: { type: 'object', description: 'Upload result from GCS' },
                        filePath: { type: 'string', example: 'D:\\temp\\nest.jpg' },
                    },
                },
                message: { type: 'string', example: 'File uploaded successfully' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid file path' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('filePath')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "uploadFileGcp", null);
StorageController = __decorate([
    (0, swagger_1.ApiTags)('Storage'),
    (0, common_1.Controller)('api/v1/storage'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)(response_interceptor_1.ResponseInterceptor),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], StorageController);
exports.StorageController = StorageController;
//# sourceMappingURL=storage.controller.js.map