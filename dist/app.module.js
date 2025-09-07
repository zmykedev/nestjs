"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const config_1 = require("./config");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const books_module_1 = require("./books/books.module");
const audit_log_module_1 = require("./common/audit-log.module");
const storage_module_1 = require("./storage/storage.module");
const envFile_1 = require("./utils/config/envFile");
const config_2 = require("@nestjs/config");
const devtools_integration_1 = require("@nestjs/devtools-integration");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const audit_log_interceptor_1 = require("./common/interceptors/audit-log.interceptor");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_2.ConfigModule.forRoot({
                load: [config_1.default],
                isGlobal: true,
                envFilePath: (0, envFile_1.getEnvFilePath)(),
                validationOptions: { abortEarly: true },
            }),
            devtools_integration_1.DevtoolsModule.registerAsync({
                inject: [config_1.default.KEY],
                useFactory: (configService) => ({
                    enabled: configService.devtools.enabled,
                    port: configService.devtools.port,
                    http: process.env.NODE_ENV !== 'production',
                }),
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST,
                port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                autoLoadEntities: true,
                synchronize: true,
                migrations: [__dirname + '/../migrations/*.ts'],
                migrationsRun: true,
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            books_module_1.BooksModule,
            audit_log_module_1.AuditLogModule,
            storage_module_1.StorageModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_log_interceptor_1.AuditLogInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map