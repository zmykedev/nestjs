import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './services/books.service.sequelize';
import { StorageService } from '../storage/services/storage.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('Books Integration Tests (Unit)', () => {
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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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

    controller = moduleFixture.get<BooksController>(BooksController);
    service = moduleFixture.get<BooksService>(BooksService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Controller Integration', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: 'Fiction',
        description: 'Test description',
      };

      const mockBook = {
        id: '1',
        ...createBookDto,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);

      expect(service.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBook);
    });

    it('should return all books', async () => {
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
  });

});

