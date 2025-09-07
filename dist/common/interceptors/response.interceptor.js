"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseHelper = exports.ErrorResponseInterceptor = exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        return next.handle().pipe((0, operators_1.map)((data) => {
            var _a;
            const method = request.method;
            const path = ((_a = request.route) === null || _a === void 0 ? void 0 : _a.path) || request.url;
            let message = 'Operación exitosa';
            switch (method) {
                case 'GET':
                    if (path.includes('/:id')) {
                        message = 'Registro encontrado exitosamente';
                    }
                    else {
                        message = 'Registros obtenidos exitosamente';
                    }
                    break;
                case 'POST':
                    message = 'Registro creado exitosamente';
                    break;
                case 'PUT':
                case 'PATCH':
                    message = 'Registro actualizado exitosamente';
                    break;
                case 'DELETE':
                    message = 'Registro eliminado exitosamente';
                    break;
            }
            const responseData = {
                status: true,
                data: data || null,
                message,
                timestamp: new Date().toISOString(),
                path,
                method,
                statusCode: response.statusCode,
            };
            if (data &&
                typeof data === 'object' &&
                'items' in data &&
                'meta' in data) {
                responseData.data = data.items;
                responseData.pagination = {
                    page: data.meta.page || 1,
                    limit: data.meta.limit || 10,
                    total: data.meta.total || 0,
                    totalPages: Math.ceil((data.meta.total || 0) / (data.meta.limit || 10)),
                };
            }
            return responseData;
        }));
    }
};
ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
exports.ResponseInterceptor = ResponseInterceptor;
let ErrorResponseInterceptor = class ErrorResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            var _a;
            if (data && data.statusCode && data.statusCode >= 400) {
                return {
                    status: false,
                    data: null,
                    message: data.message || 'Error en la operación',
                    timestamp: new Date().toISOString(),
                    path: ((_a = context.switchToHttp().getRequest().route) === null || _a === void 0 ? void 0 : _a.path) ||
                        context.switchToHttp().getRequest().url,
                    method: context.switchToHttp().getRequest().method,
                    statusCode: data.statusCode,
                    errors: data.errors || [],
                };
            }
            return data;
        }));
    }
};
ErrorResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ErrorResponseInterceptor);
exports.ErrorResponseInterceptor = ErrorResponseInterceptor;
class ApiResponseHelper {
    static success(data, message, statusCode = common_1.HttpStatus.OK) {
        return {
            status: true,
            data,
            message: message || 'Operación exitosa',
            timestamp: new Date().toISOString(),
            path: '',
            method: '',
            statusCode,
        };
    }
    static error(message, statusCode = common_1.HttpStatus.BAD_REQUEST, errors) {
        return {
            status: false,
            data: null,
            message,
            timestamp: new Date().toISOString(),
            path: '',
            method: '',
            statusCode,
            errors,
        };
    }
    static paginated(items, page, limit, total, message) {
        return {
            status: true,
            data: items,
            message: message || 'Registros obtenidos exitosamente',
            timestamp: new Date().toISOString(),
            path: '',
            method: '',
            statusCode: common_1.HttpStatus.OK,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
exports.ApiResponseHelper = ApiResponseHelper;
//# sourceMappingURL=response.interceptor.js.map