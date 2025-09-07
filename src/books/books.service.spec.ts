import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto, SortField, SortDirection } from './dto/query-book.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      mockRepository.create.mockReturnValue(mockBook);
      mockRepository.save.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createBookDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockBook);
      expect(result).toEqual(mockBook);
    });

    it('should throw BadRequestException when creation fails', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: 'Fiction',
      };

      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createBookDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated books with default values', async () => {
      const queryDto: QueryBookDto = {};
      const mockBooks = [
        { id: '1', title: 'Book 1' },
        { id: '2', title: 'Book 2' },
      ];

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockBooks, 2]);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        books: mockBooks,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should apply search filter correctly', async () => {
      const queryDto: QueryBookDto = { search: 'test' };
      const mockBooks = [{ id: '1', title: 'Test Book' }];

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockBooks, 1]);

      await service.findAll(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'book.title ILIKE :search',
        { search: '%test%' },
      );
    });

    it('should throw BadRequestException when query fails', async () => {
      const queryDto: QueryBookDto = {};

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getManyAndCount.mockRejectedValue(
        new Error('Query error'),
      );

      await expect(service.findAll(queryDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const mockBook = { id: '1', title: 'Test Book' };

      mockRepository.findOne.mockResolvedValue(mockBook);

      const result = await service.findOne('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
      });
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException when book not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when query fails', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a book successfully', async () => {
      const updateBookDto: UpdateBookDto = { title: 'Updated Book' };
      const existingBook = { id: '1', title: 'Old Title' };
      const updatedBook = { ...existingBook, ...updateBookDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingBook as Book);
      mockRepository.save.mockResolvedValue(updatedBook);

      const result = await service.update('1', updateBookDto);

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(mockRepository.save).toHaveBeenCalledWith(updatedBook);
      expect(result).toEqual(updatedBook);
    });

    it('should throw BadRequestException when update fails', async () => {
      const updateBookDto: UpdateBookDto = { title: 'Updated Book' };
      const existingBook = { id: '1', title: 'Old Title' };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingBook as Book);
      mockRepository.save.mockRejectedValue(new Error('Update error'));

      await expect(service.update('1', updateBookDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a book successfully', async () => {
      const existingBook = { id: '1', title: 'Test Book' };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingBook as Book);
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(mockRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw BadRequestException when deletion fails', async () => {
      const existingBook = { id: '1', title: 'Test Book' };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingBook as Book);
      mockRepository.softDelete.mockRejectedValue(new Error('Delete error'));

      await expect(service.remove('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getGenres', () => {
    it('should return all unique genres', async () => {
      const mockGenres = [{ genre: 'Fiction' }, { genre: 'Non-Fiction' }];
      const expectedGenres = ['Fiction', 'Non-Fiction'];

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getRawMany.mockResolvedValue(mockGenres);

      const result = await service.getGenres();

      expect(result).toEqual(expectedGenres);
    });

    it('should throw BadRequestException when query fails', async () => {
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getRawMany.mockRejectedValue(new Error('Query error'));

      await expect(service.getGenres()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getPublishers', () => {
    it('should return all unique publishers', async () => {
      const mockPublishers = [
        { publisher: 'Publisher 1' },
        { publisher: 'Publisher 2' },
      ];
      const expectedPublishers = ['Publisher 1', 'Publisher 2'];

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getRawMany.mockResolvedValue(mockPublishers);

      const result = await service.getPublishers();

      expect(result).toEqual(expectedPublishers);
    });

    it('should throw BadRequestException when query fails', async () => {
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getRawMany.mockRejectedValue(new Error('Query error'));

      await expect(service.getPublishers()).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('exportToCSV', () => {
    it('should export books to CSV format', async () => {
      const mockBooks = [
        {
          id: '1',
          title: 'Book 1',
          author: 'Author 1',
          publisher: 'Publisher 1',
          price: 29.99,
          availability: true,
          genre: 'Fiction',
          stock: 10,

          createdAt: new Date('2024-01-01'),
        },
      ];

      mockRepository.find.mockResolvedValue(mockBooks);

      const result = await service.exportToCSV();

      expect(result).toContain(
        'ID,Título,Autor,Editorial,Precio,Disponibilidad,Género,Stock,Creado',
      );
      expect(result).toContain('Book 1');
      expect(result).toContain('Author 1');
    });

    it('should throw BadRequestException when export fails', async () => {
      mockRepository.find.mockRejectedValue(new Error('Export error'));

      await expect(service.exportToCSV()).rejects.toThrow(BadRequestException);
    });
  });
});
