import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './services/storage.service';
import { SecretService } from './services/secret.service';
import { StorageController } from './controllers/storage.controller';

@Module({
  imports: [ConfigModule],
  providers: [StorageService, SecretService],
  controllers: [StorageController],
  exports: [StorageService, SecretService],
})
export class StorageModule {}
