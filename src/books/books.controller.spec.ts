import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { Book } from './entities/book.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BooksController', () => {
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
      };

      const mockBook = {
        id: '1',
        ...createBookDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);

      expect(service.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const queryDto: QueryBookDto = { page: 1, limit: 10 };
      const mockResponse = {
        books: [{ id: '1', title: 'Book 1' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockBooksService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(service.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const mockBook = { id: '1', title: 'Test Book' };
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('should update a book successfully', async () => {
      const updateBookDto: UpdateBookDto = { title: 'Updated Book' };
      const mockBook = { id: '1', title: 'Updated Book' };
      mockBooksService.update.mockResolvedValue(mockBook);

      const result = await controller.update('1', updateBookDto);

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
  });

  describe('getGenres', () => {
    it('should return all genres', async () => {
      const mockGenres = ['Fiction', 'Non-Fiction'];
      mockBooksService.getGenres.mockResolvedValue(mockGenres);

      const result = await controller.getGenres();

      expect(service.getGenres).toHaveBeenCalled();
      expect(result).toEqual(mockGenres);
    });
  });

  describe('getPublishers', () => {
    it('should return all publishers', async () => {
      const mockPublishers = ['Publisher 1', 'Publisher 2'];
      mockBooksService.getPublishers.mockResolvedValue(mockPublishers);

      const result = await controller.getPublishers();

      expect(service.getPublishers).toHaveBeenCalled();
      expect(result).toEqual(mockPublishers);
    });
  });

  describe('exportToCSV', () => {
    it('should export books to CSV successfully', async () => {
      const mockCsv = 'ID,Título,Autor\n1,Book 1,Author 1';
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
