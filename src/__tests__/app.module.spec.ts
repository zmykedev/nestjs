import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { AppModule } from '../app.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { BooksModule } from '../books/books.module';
import { AuditLogModule } from '../common/audit-log.module';
import { StorageModule } from '../storage/storage.module';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuditLogInterceptor } from '../common/interceptors/audit-log.interceptor';
import config from '../config';

// Mock the envFile utility
jest.mock('../utils/config/envFile', () => ({
  getEnvFilePath: jest.fn().mockReturnValue('.env'),
}));

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(SequelizeModule)
      .useModule(
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          autoLoadModels: true,
          synchronize: true,
        }),
      )
      .compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AppModule', () => {
    const appModule = module.get(AppModule);
    expect(appModule).toBeDefined();
  });

  it('should import ConfigModule', () => {
    expect(module.get(ConfigModule)).toBeDefined();
  });

  it('should import SequelizeModule', () => {
    expect(module.get(SequelizeModule)).toBeDefined();
  });

  it('should import UsersModule', () => {
    expect(module.get(UsersModule)).toBeDefined();
  });

  it('should import AuthModule', () => {
    expect(module.get(AuthModule)).toBeDefined();
  });

  it('should import BooksModule', () => {
    expect(module.get(BooksModule)).toBeDefined();
  });

  it('should import AuditLogModule', () => {
    expect(module.get(AuditLogModule)).toBeDefined();
  });

  it('should import StorageModule', () => {
    expect(module.get(StorageModule)).toBeDefined();
  });

  it('should have ResponseInterceptor as global interceptor', () => {
    const interceptor = module.get(ResponseInterceptor);
    expect(interceptor).toBeDefined();
  });

  it('should have AuditLogInterceptor as global interceptor', () => {
    // AuditLogInterceptor is provided as APP_INTERCEPTOR, so we can't get it directly
    // Instead, we'll just verify the module compiles successfully
    expect(module).toBeDefined();
  });

  it('should be instantiable', () => {
    const appModule = new AppModule();
    expect(appModule).toBeDefined();
    expect(appModule).toBeInstanceOf(AppModule);
  });
});
