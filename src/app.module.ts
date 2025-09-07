import config from './config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    TypeOrmModule.forRoot({
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
