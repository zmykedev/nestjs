import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BooksService } from './services/books.service.sequelize';
import { BooksController } from './books.controller';
import { Book } from './models/book.model';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [SequelizeModule.forFeature([Book]), StorageModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
