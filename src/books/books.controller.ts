import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBooksDto } from './dto/search-books.dto';
import { Book } from './entities/book.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StorageService } from '../storage/services/storage.service';

@ApiTags('books')
@Controller('books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully',
    type: Book,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Post('search')
  @ApiOperation({
    summary: 'Search books with advanced filtering, sorting and pagination',
    description:
      'Search books using multiple criteria including title, author, genre, price range, availability, and more. Supports sorting and pagination for large result sets.',
  })
  @ApiResponse({
    status: 200,
    description: 'Books retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            books: {
              type: 'array',
              items: { $ref: '#/components/schemas/Book' },
            },
            total: { type: 'number', example: 150 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            totalPages: { type: 'number', example: 8 },
          },
        },
        message: { type: 'string', example: 'Books retrieved successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid search parameters',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  searchBooks(@Body() searchDto: SearchBooksDto) {
    const result = this.booksService.findAll(searchDto.query);
    return result;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all books (simple list without filters)',
    description:
      'Retrieve a simple list of all books in the system without advanced filtering. Useful for basic browsing and simple applications.',
  })
  @ApiResponse({
    status: 200,
    description: 'Books retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Book' },
        },
        message: { type: 'string', example: 'Books retrieved successfully' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  findAll() {
    return this.booksService.findAll({});
  }

  @Post('upload-image-only')
  @ApiOperation({ summary: 'Upload image only and return URL' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Imagen subida exitosamente' },
        imageUrl: {
          type: 'string',
          example: 'https://storage.googleapis.com/bucket/image.jpg',
        },
        originalName: { type: 'string', example: 'image.jpg' },
        size: { type: 'number', example: 1024000 },
        mimeType: { type: 'string', example: 'image/jpeg' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file or file too large',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageOnly(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar tipo de archivo
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF, WebP',
      );
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'El archivo es demasiado grande. Tamaño máximo: 5MB',
      );
    }

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(
      tempDir,
      `upload-${Date.now()}-${file.originalname}`,
    );

    try {
      // Escribir archivo temporal
      fs.writeFileSync(tempFilePath, file.buffer);

      // Generate custom file name with timestamp to avoid conflicts
      const customFileName = `books-${Date.now()}-${file.originalname}`;
      const uploadResult = await this.storageService.uploadFileAndGetPublicUrl(
        tempFilePath,
        customFileName,
      );

      // Limpiar archivo temporal
      fs.unlinkSync(tempFilePath);

      return {
        success: true,
        message: 'Imagen subida exitosamente',
        imageUrl: uploadResult.publicUrl,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        fileName: uploadResult.fileName,
        bucketName: uploadResult.bucketName,
      };
    } catch (error) {
      // Limpiar archivo temporal si existe
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      console.error('Error uploading image:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al subir la imagen: ${errorMessage}`,
      );
    }
  }

  @Get('genres')
  @ApiOperation({ summary: 'Get all available genres' })
  @ApiResponse({
    status: 200,
    description: 'Genres retrieved successfully',
    type: [String],
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getGenres(): string[] {
    return this.booksService.getGenres();
  }

  @Get('genres/cmpc-specific')
  @ApiOperation({ summary: 'Get CMPC specific genres' })
  @ApiResponse({
    status: 200,
    description: 'CMPC specific genres retrieved successfully',
    type: [String],
  })
  getCmpcSpecificGenres(): string[] {
    return this.booksService.getCmpcSpecificGenres();
  }

  @Get('genres/traditional')
  @ApiOperation({ summary: 'Get traditional genres' })
  @ApiResponse({
    status: 200,
    description: 'Traditional genres retrieved successfully',
    type: [String],
  })
  getTraditionalGenres(): string[] {
    return this.booksService.getTraditionalGenres();
  }

  @Get('genres/descriptions')
  @ApiOperation({ summary: 'Get genres with descriptions' })
  @ApiResponse({
    status: 200,
    description: 'Genres with descriptions retrieved successfully',
  })
  getGenreDescriptions() {
    return this.booksService.getGenreDescriptions();
  }

  @Get('authors')
  @ApiOperation({ summary: 'Get all available authors' })
  @ApiResponse({
    status: 200,
    description: 'Authors retrieved successfully',
    type: [String],
  })
  getAuthors(): string[] {
    return this.booksService.getAuthors();
  }

  @Get('authors/cmpc-specific')
  @ApiOperation({ summary: 'Get CMPC specific authors' })
  @ApiResponse({
    status: 200,
    description: 'CMPC specific authors retrieved successfully',
    type: [String],
  })
  getCmpcSpecificAuthors(): string[] {
    return this.booksService.getCmpcSpecificAuthors();
  }

  @Get('authors/traditional')
  @ApiOperation({ summary: 'Get traditional authors' })
  @ApiResponse({
    status: 200,
    description: 'Traditional authors retrieved successfully',
    type: [String],
  })
  getTraditionalAuthors(): string[] {
    return this.booksService.getTraditionalAuthors();
  }

  @Get('authors/descriptions')
  @ApiOperation({ summary: 'Get authors with descriptions' })
  @ApiResponse({
    status: 200,
    description: 'Authors with descriptions retrieved successfully',
  })
  getAuthorDescriptions() {
    return this.booksService.getAuthorDescriptions();
  }

  @Get('publishers')
  @ApiOperation({ summary: 'Get all available publishers' })
  @ApiResponse({
    status: 200,
    description: 'Publishers retrieved successfully',
    type: [String],
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getPublishers(): string[] {
    return this.booksService.getPublishers();
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export all books to CSV format' })
  @ApiResponse({ status: 200, description: 'CSV exported successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async exportToCSV(@Res() res: Response): Promise<void> {
    try {
      const csv = await this.booksService.exportToCSV();

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=books.csv');
      res.status(HttpStatus.OK).send(csv);
    } catch {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Error exporting to CSV' });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiResponse({
    status: 200,
    description: 'Book retrieved successfully',
    type: Book,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({
    status: 200,
    description: 'Book updated successfully',
    type: Book,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Book not found' })
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Book not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.booksService.remove(id);
  }
}
