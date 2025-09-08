import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BooksController } from '../books.controller';
import { BooksService } from '../services/books.service.sequelize';
import { StorageService } from '../../storage/services/storage.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { SearchBooksDto } from '../dto/search-books.dto';
import { Book } from '../models/book.model';

// Mock fs module
jest.mock('fs');
const mockFs = require('fs');

// Mock os module
jest.mock('os');
const mockOs = require('os');

// Mock path module
jest.mock('path');
const mockPath = require('path');

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: jest.Mocked<BooksService>;
  let storageService: jest.Mocked<StorageService>;

  beforeEach(async () => {
    const mockBooksService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getGenres: jest.fn(),
      getCmpcSpecificGenres: jest.fn(),
      getTraditionalGenres: jest.fn(),
      getGenreDescriptions: jest.fn(),
      getAuthors: jest.fn(),
      getCmpcSpecificAuthors: jest.fn(),
      getTraditionalAuthors: jest.fn(),
      getAuthorDescriptions: jest.fn(),
      getPublishers: jest.fn(),
      exportToCSV: jest.fn(),
    };

    const mockStorageService = {
      uploadFileAndGetPublicUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    booksService = module.get(BooksService);
    storageService = module.get(StorageService);

    // Setup default mocks
    mockOs.tmpdir.mockReturnValue('/tmp');
    mockPath.join.mockImplementation((...args) => args.join('/'));
    mockFs.writeFileSync.mockImplementation(() => {});
    mockFs.unlinkSync.mockImplementation(() => {});
    mockFs.existsSync.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        publisher: 'Test Publisher',
        isbn: '1234567890',
        publicationYear: 2024,
        description: 'Test description',
        imageUrl: 'https://example.com/image.jpg',
      };

      const mockBook = {
        id: 1,
        ...createBookDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Book;

      booksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);

      expect(booksService.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('searchBooks', () => {
    it('should search books', () => {
      const searchDto: SearchBooksDto = {
        query: {
          search: 'test',
          page: 1,
          limit: 10,
        },
      };

      const mockResult = {
        items: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };

      booksService.findAll.mockReturnValue(mockResult as any);

      const result = controller.searchBooks(searchDto);

      expect(booksService.findAll).toHaveBeenCalledWith(searchDto.query);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return all books', () => {
      const mockBooks = [
        { id: 1, title: 'Book 1' },
        { id: 2, title: 'Book 2' },
      ] as Book[];

      booksService.findAll.mockReturnValue(mockBooks as any);

      const result = controller.findAll();

      expect(booksService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(mockBooks);
    });
  });

  describe('uploadImageOnly', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('test'),
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };

    it('should upload image successfully', async () => {
      const mockUploadResult = {
        publicUrl: 'https://example.com/image.jpg',
        fileName: 'books-1234567890-test.jpg',
        bucketName: 'imgbb',
      };

      storageService.uploadFileAndGetPublicUrl.mockResolvedValue(mockUploadResult);

      const result = await controller.uploadImageOnly(mockFile);

      expect(storageService.uploadFileAndGetPublicUrl).toHaveBeenCalledWith(
        expect.stringContaining('/tmp/upload-'),
        expect.stringContaining('books-'),
      );
      expect(result).toEqual({
        success: true,
        message: 'Imagen subida exitosamente',
        imageUrl: 'https://example.com/image.jpg',
        originalName: 'test.jpg',
        size: 1024,
        mimeType: 'image/jpeg',
        fileName: 'books-1234567890-test.jpg',
        bucketName: 'imgbb',
      });
    });

    it('should throw error when no file provided', async () => {
      await expect(controller.uploadImageOnly(null)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.uploadImageOnly(null)).rejects.toThrow(
        'No se proporcionó ningún archivo',
      );
    });

    it('should throw error for invalid file type', async () => {
      const invalidFile = { ...mockFile, mimetype: 'text/plain' };

      await expect(controller.uploadImageOnly(invalidFile)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.uploadImageOnly(invalidFile)).rejects.toThrow(
        'Tipo de archivo no permitido',
      );
    });

    it('should throw error for file too large', async () => {
      const largeFile = { ...mockFile, size: 6 * 1024 * 1024 }; // 6MB

      await expect(controller.uploadImageOnly(largeFile)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.uploadImageOnly(largeFile)).rejects.toThrow(
        'El archivo es demasiado grande',
      );
    });

    it('should handle upload error and clean up temp file', async () => {
      const error = new Error('Upload failed');
      storageService.uploadFileAndGetPublicUrl.mockRejectedValue(error);

      await expect(controller.uploadImageOnly(mockFile)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.uploadImageOnly(mockFile)).rejects.toThrow(
        'Error al subir la imagen: Upload failed',
      );

      expect(mockFs.unlinkSync).toHaveBeenCalled();
    });

    it('should handle upload error when temp file does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false);
      const error = new Error('Upload failed');
      storageService.uploadFileAndGetPublicUrl.mockRejectedValue(error);

      await expect(controller.uploadImageOnly(mockFile)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockFs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should handle unknown error type', async () => {
      storageService.uploadFileAndGetPublicUrl.mockRejectedValue('Unknown error');

      await expect(controller.uploadImageOnly(mockFile)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.uploadImageOnly(mockFile)).rejects.toThrow(
        'Error al subir la imagen: Error desconocido',
      );
    });
  });

  describe('getGenres', () => {
    it('should return all genres', () => {
      const mockGenres = ['Fiction', 'Non-Fiction', 'Science Fiction'];
      booksService.getGenres.mockReturnValue(mockGenres);

      const result = controller.getGenres();

      expect(booksService.getGenres).toHaveBeenCalled();
      expect(result).toEqual(mockGenres);
    });
  });

  describe('getCmpcSpecificGenres', () => {
    it('should return CMPC specific genres', () => {
      const mockGenres = ['Industrial History', 'Forestry'];
      booksService.getCmpcSpecificGenres.mockReturnValue(mockGenres);

      const result = controller.getCmpcSpecificGenres();

      expect(booksService.getCmpcSpecificGenres).toHaveBeenCalled();
      expect(result).toEqual(mockGenres);
    });
  });

  describe('getTraditionalGenres', () => {
    it('should return traditional genres', () => {
      const mockGenres = ['Fiction', 'Non-Fiction'];
      booksService.getTraditionalGenres.mockReturnValue(mockGenres);

      const result = controller.getTraditionalGenres();

      expect(booksService.getTraditionalGenres).toHaveBeenCalled();
      expect(result).toEqual(mockGenres);
    });
  });

  describe('getGenreDescriptions', () => {
    it('should return genre descriptions', () => {
      const mockDescriptions = [
        { genre: 'Fiction', description: 'Fictional works' },
        { genre: 'Non-Fiction', description: 'Non-fictional works' },
      ];
      booksService.getGenreDescriptions.mockReturnValue(mockDescriptions);

      const result = controller.getGenreDescriptions();

      expect(booksService.getGenreDescriptions).toHaveBeenCalled();
      expect(result).toEqual(mockDescriptions);
    });
  });

  describe('getAuthors', () => {
    it('should return all authors', () => {
      const mockAuthors = ['Author 1', 'Author 2', 'Author 3'];
      booksService.getAuthors.mockReturnValue(mockAuthors);

      const result = controller.getAuthors();

      expect(booksService.getAuthors).toHaveBeenCalled();
      expect(result).toEqual(mockAuthors);
    });
  });

  describe('getCmpcSpecificAuthors', () => {
    it('should return CMPC specific authors', () => {
      const mockAuthors = ['Industrial Expert', 'Forestry Specialist'];
      booksService.getCmpcSpecificAuthors.mockReturnValue(mockAuthors);

      const result = controller.getCmpcSpecificAuthors();

      expect(booksService.getCmpcSpecificAuthors).toHaveBeenCalled();
      expect(result).toEqual(mockAuthors);
    });
  });

  describe('getTraditionalAuthors', () => {
    it('should return traditional authors', () => {
      const mockAuthors = ['Classic Author', 'Modern Author'];
      booksService.getTraditionalAuthors.mockReturnValue(mockAuthors);

      const result = controller.getTraditionalAuthors();

      expect(booksService.getTraditionalAuthors).toHaveBeenCalled();
      expect(result).toEqual(mockAuthors);
    });
  });

  describe('getAuthorDescriptions', () => {
    it('should return author descriptions', () => {
      const mockDescriptions = [
        { author: 'Author 1', description: 'Expert in field' },
        { author: 'Author 2', description: 'Specialist in area' },
      ];
      booksService.getAuthorDescriptions.mockReturnValue(mockDescriptions);

      const result = controller.getAuthorDescriptions();

      expect(booksService.getAuthorDescriptions).toHaveBeenCalled();
      expect(result).toEqual(mockDescriptions);
    });
  });

  describe('getPublishers', () => {
    it('should return all publishers', () => {
      const mockPublishers = ['Publisher 1', 'Publisher 2', 'Publisher 3'];
      booksService.getPublishers.mockReturnValue(mockPublishers);

      const result = controller.getPublishers();

      expect(booksService.getPublishers).toHaveBeenCalled();
      expect(result).toEqual(mockPublishers);
    });
  });

  describe('exportToCSV', () => {
    it('should export books to CSV successfully', async () => {
      const mockCsv = 'id,title,author\n1,Book 1,Author 1\n2,Book 2,Author 2';
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      booksService.exportToCSV.mockResolvedValue(mockCsv);

      await controller.exportToCSV(mockResponse);

      expect(booksService.exportToCSV).toHaveBeenCalled();
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=books.csv',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(mockCsv);
    });

    it('should handle CSV export error', async () => {
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      booksService.exportToCSV.mockRejectedValue(new Error('Export failed'));

      await controller.exportToCSV(mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error exporting to CSV',
      });
    });
  });

  describe('findOne', () => {
    it('should return a book by ID', async () => {
      const mockBook = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
      } as Book;

      booksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne('1');

      expect(booksService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('should update a book (partial update)', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        description: 'Updated description',
      };

      const mockBook = {
        id: 1,
        title: 'Updated Book',
        description: 'Updated description',
      } as Book;

      booksService.update.mockResolvedValue(mockBook);

      const result = await controller.update('1', updateBookDto);

      expect(booksService.update).toHaveBeenCalledWith('1', updateBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('updateFull', () => {
    it('should update a book (full update)', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
        genre: 'Updated Genre',
      };

      const mockBook = {
        id: 1,
        title: 'Updated Book',
        author: 'Updated Author',
        genre: 'Updated Genre',
      } as Book;

      booksService.update.mockResolvedValue(mockBook);

      const result = await controller.updateFull('1', updateBookDto);

      expect(booksService.update).toHaveBeenCalledWith('1', updateBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      booksService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(booksService.remove).toHaveBeenCalledWith('1');
      expect(result).toBeUndefined();
    });
  });
});
