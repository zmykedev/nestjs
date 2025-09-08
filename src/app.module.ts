import config from './config';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { AuditLogModule } from './common/audit-log.module';
import { StorageModule } from './storage/storage.module';
import { getEnvFilePath } from './utils/config/envFile';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: getEnvFilePath(),
      validationOptions: { abortEarly: true },
    }),
    DevtoolsModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        enabled: configService.devtools.enabled,
        port: configService.devtools.port,
        http: process.env.NODE_ENV !== 'production',
      }),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'cmpc_db',
      autoLoadModels: true,
      synchronize: false, // Disabled to avoid conflicts with existing TypeORM schema

      // Pool de conexiones optimizado para Sequelize
      pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000,
      },

      // Configuración de modelos
      define: {
        timestamps: true,
        paranoid: true, // Soft delete automático
        underscored: false, // camelCase
        freezeTableName: true, // No pluralizar
      },

      // SSL para producción
      dialectOptions:
        process.env.NODE_ENV === 'production'
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : {},

      // Logging
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }),
    UsersModule,
    AuthModule,
    BooksModule,
    AuditLogModule,
    StorageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
