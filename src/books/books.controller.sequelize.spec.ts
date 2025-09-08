import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './services/books.service.sequelize';
import { StorageService } from '../storage/services/storage.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto, SortField, SortDirection } from './dto/query-book.dto';
import { Book } from './models/book.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BooksController (Sequelize)', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getGenres: jest.fn(),
    getPublishers: jest.fn(),
    exportToCSV: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        {
          provide: StorageService,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: 'Fiction',
        description: 'Test description',
      };

      const mockBook: Book = {
        id: '1',
        ...createBookDto,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      } as Book;

      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);

      expect(service.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBook);
    });

    it('should handle validation errors', async () => {
      const invalidDto = {
        title: '', // Invalid: empty title
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: -10, // Invalid: negative price
        availability: true,
        genre: 'Fiction',
      } as CreateBookDto;

      mockBooksService.create.mockRejectedValue(
        new BadRequestException('Validation failed'),
      );

      await expect(controller.create(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated books with default parameters', async () => {
      const mockResponse = {
        books: [
          {
            id: '1',
            title: 'Book 1',
            author: 'Author 1',
            publisher: 'Publisher 1',
            price: 29.99,
            availability: true,
            genre: 'Fiction',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockBooksService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResponse);
    });

    it('should return paginated books with custom parameters', async () => {
      const queryDto: QueryBookDto = {
        page: 2,
        limit: 20,
        search: 'test',
        genre: 'Fiction',
        sortBy: SortField.TITLE,
        sortDir: SortDirection.ASC,
      };

      const mockResponse = {
        books: [],
        total: 0,
        page: 2,
        limit: 20,
        totalPages: 0,
      };

      mockBooksService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResponse);
    });

    it('should handle search and filter parameters', async () => {
      const queryDto: QueryBookDto = {
        search: 'harry potter',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        publisher: 'Bloomsbury',
        availability: true,
        priceMin: 10,
        priceMax: 50,
      };

      const mockResponse = {
        books: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockBooksService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const mockBook: Book = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: 'Fiction',
        description: 'Test description',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      } as Book;

      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException when book is not found', async () => {
      mockBooksService.findOne.mockRejectedValue(
        new NotFoundException('Book not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('update (PATCH)', () => {
    it('should update a book successfully with partial data', async () => {
      const updateBookDto: UpdateBookDto = { title: 'Updated Book' };
      const mockBook: Book = {
        id: '1',
        title: 'Updated Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: 'Fiction',
        description: 'Test description',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as Book;

      mockBooksService.update.mockResolvedValue(mockBook);

      const result = await controller.update('1', updateBookDto);

      expect(service.update).toHaveBeenCalledWith('1', updateBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('updateFull (PUT)', () => {
    it('should update a book successfully with full data', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
        publisher: 'Updated Publisher',
        price: 34.99,
        availability: false,
        genre: 'Non-Fiction',
        description: 'Updated description',
      };

      const mockBook: Book = {
        id: '1',
        ...updateBookDto,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as Book;

      mockBooksService.update.mockResolvedValue(mockBook);

      const result = await controller.updateFull('1', updateBookDto);

      expect(service.update).toHaveBeenCalledWith('1', updateBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('remove', () => {
    it('should remove a book successfully', async () => {
      mockBooksService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when trying to remove non-existent book', async () => {
      mockBooksService.remove.mockRejectedValue(
        new NotFoundException('Book not found'),
      );

      await expect(controller.remove('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith('999');
    });
  });

  describe('getGenres', () => {
    it('should return all genres', async () => {
      const mockGenres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery'];
      mockBooksService.getGenres.mockResolvedValue(mockGenres);

      const result = await controller.getGenres();

      expect(service.getGenres).toHaveBeenCalled();
      expect(result).toEqual(mockGenres);
    });
  });

  describe('getPublishers', () => {
    it('should return all publishers', async () => {
      const mockPublishers = ['Publisher 1', 'Publisher 2', 'Publisher 3'];
      mockBooksService.getPublishers.mockResolvedValue(mockPublishers);

      const result = await controller.getPublishers();

      expect(service.getPublishers).toHaveBeenCalled();
      expect(result).toEqual(mockPublishers);
    });
  });

  describe('exportToCSV', () => {
    it('should export books to CSV successfully', async () => {
      const mockCsv = 'ID,Título,Autor,Editorial,Precio,Género,Disponibilidad\n1,Book 1,Author 1,Publisher 1,29.99,Fiction,true';
      const mockResponse = {
        setHeader: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockBooksService.exportToCSV.mockResolvedValue(mockCsv);

      await controller.exportToCSV(mockResponse as any);

      expect(service.exportToCSV).toHaveBeenCalled();
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/csv',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=books.csv',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockCsv);
    });

    it('should handle export errors gracefully', async () => {
      const mockResponse = {
        setHeader: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockBooksService.exportToCSV.mockRejectedValue(
        new Error('Export failed'),
      );

      await controller.exportToCSV(mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error exporting to CSV',
      });
    });
  });

});
