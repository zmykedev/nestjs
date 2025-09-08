import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './services/storage.service';
import { ImgBBService } from './services/imgbb.service';
import { StorageController } from './controllers/storage.controller';

@Module({
  imports: [ConfigModule],
  providers: [StorageService, ImgBBService],
  controllers: [StorageController],
  exports: [StorageService, ImgBBService],
})
export class StorageModule {}
