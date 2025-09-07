"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const request = context
            .switchToHttp()
            .getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, body, user, ip } = request;
        const userAgent = request.get('User-Agent') || '';
        const startTime = Date.now();
        this.logger.log(`Incoming ${method} ${url} - User: ${(user === null || user === void 0 ? void 0 : user.id) || 'anonymous'} - IP: ${ip} - User-Agent: ${userAgent}`);
        if (body && Object.keys(body).length > 0) {
            const sanitizedBody = this.sanitizeRequestBody(body);
            this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
        }
        return next.handle().pipe((0, operators_1.tap)((data) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const statusCode = response.statusCode;
            this.logger.log(`Outgoing ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms - User: ${(user === null || user === void 0 ? void 0 : user.id) || 'anonymous'}`);
            if (process.env.NODE_ENV === 'development') {
                this.logger.debug(`Response Data: ${JSON.stringify(data)}`);
            }
        }), (0, operators_1.catchError)((error) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const statusCode = error.status || 500;
            this.logger.error(`Error ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms - User: ${(user === null || user === void 0 ? void 0 : user.id) || 'anonymous'} - Error: ${error.message}`, error.stack);
            throw error;
        }));
    }
    sanitizeRequestBody(body) {
        const sensitiveFields = [
            'password',
            'token',
            'refreshToken',
            'secret',
            'key',
        ];
        const sanitized = Object.assign({}, body);
        sensitiveFields.forEach((field) => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });
        return sanitized;
    }
};
LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logging.interceptor.js.map