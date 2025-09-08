import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BooksService } from './books.service.sequelize';
import { Book } from '../models/book.model';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { QueryBookDto, SortField, SortDirection } from '../dto/query-book.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

describe('BooksService (Sequelize)', () => {
  let service: BooksService;
  let bookModel: typeof Book;
  let sequelize: Sequelize;

  const mockBookModel = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    transaction: jest.fn(),
  };

  const mockSequelize = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book),
          useValue: mockBookModel,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookModel = module.get<typeof Book>(getModelToken(Book));
    sequelize = module.get<Sequelize>(Sequelize);
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
        description: 'Test description',
      };

      const mockBook = {
        id: '1',
        ...createBookDto,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        toJSON: jest.fn().mockReturnValue({
          id: '1',
          ...createBookDto,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelize.transaction.mockImplementation((callback) => {
        return callback(mockTransaction);
      });

      mockBookModel.create.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(sequelize.transaction).toHaveBeenCalled();
      expect(bookModel.create).toHaveBeenCalledWith(createBookDto, {
        transaction: mockTransaction,
      });
      expect(result).toMatchObject({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        genre: 'Fiction',
      });
    });

    it('should handle creation errors', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: 'Fiction',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelize.transaction.mockImplementation((callback) => {
        return callback(mockTransaction);
      });

      mockBookModel.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createBookDto)).rejects.toThrow('Error al crear el libro');
      // Note: rollback is called in the finally block, but the test might not catch it
    });
  });

  describe('findAll', () => {
    it('should return paginated books with default parameters', async () => {
      const queryDto: QueryBookDto = {};
      const mockBooks = [
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
      ];

      mockBookModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: mockBooks,
      });

      const result = await service.findAll(queryDto);

      expect(bookModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        order: [['title', 'ASC']],
        limit: 10,
        offset: 0,
      });

      expect(result).toEqual({
        books: mockBooks,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
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

      const mockBooks = [
        {
          id: '1',
          title: 'Test Book',
          author: 'Test Author',
          publisher: 'Test Publisher',
          price: 29.99,
          availability: true,
          genre: 'Fiction',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      mockBookModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: mockBooks,
      });

      const result = await service.findAll(queryDto);

      expect(bookModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [Symbol.for('or')]: [
            { title: { [Symbol.for('iLike')]: '%test%' } },
            { author: { [Symbol.for('iLike')]: '%test%' } },
            { description: { [Symbol.for('iLike')]: '%test%' } },
          ],
          genre: 'Fiction',
        },
        order: [['title', 'ASC']],
        limit: 20,
        offset: 20,
      });

      expect(result).toEqual({
        books: mockBooks,
        total: 1,
        page: 2,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should handle price range filters', async () => {
      const queryDto: QueryBookDto = {
        priceMin: 10,
        priceMax: 50,
      };

      mockBookModel.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: [],
      });

      const result = await service.findAll(queryDto);

      expect(bookModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          price: {
            [Symbol.for('gte')]: 10,
            [Symbol.for('lte')]: 50,
          },
        },
        order: [['title', 'ASC']],
        limit: 10,
        offset: 0,
      });

      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const mockBook = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: 'Fiction',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockBookModel.findByPk.mockResolvedValue(mockBook);

      const result = await service.findOne('1');

      expect(bookModel.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException when book is not found', async () => {
      mockBookModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(
        new NotFoundException('Libro con ID "999" no encontrado'),
      );
    });
  });

  describe('update', () => {
    it('should update a book successfully', async () => {
      const updateBookDto: UpdateBookDto = { title: 'Updated Book' };
      const mockBook = {
        id: '1',
        title: 'Updated Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: 'Fiction',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        update: jest.fn().mockResolvedValue(undefined),
        toJSON: jest.fn().mockReturnValue({
          id: '1',
          title: 'Updated Book',
          author: 'Test Author',
          publisher: 'Test Publisher',
          price: 29.99,
          availability: true,
          genre: 'Fiction',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        }),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelize.transaction.mockImplementation((callback) => {
        return callback(mockTransaction);
      });

      mockBookModel.findByPk.mockResolvedValue(mockBook);

      const result = await service.update('1', updateBookDto);

      expect(sequelize.transaction).toHaveBeenCalled();
      expect(bookModel.findByPk).toHaveBeenCalledWith('1', {
        transaction: mockTransaction,
      });
      expect(mockBook.update).toHaveBeenCalledWith(updateBookDto, {
        transaction: mockTransaction,
      });
      expect(result).toMatchObject({
        id: '1',
        title: 'Updated Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: 'Fiction',
      });
    });

    it('should throw NotFoundException when book is not found', async () => {
      const updateBookDto: UpdateBookDto = { title: 'Updated Book' };
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelize.transaction.mockImplementation((callback) => {
        return callback(mockTransaction);
      });

      mockBookModel.findByPk.mockResolvedValue(null);

      await expect(service.update('999', updateBookDto)).rejects.toThrow(
        new NotFoundException('Libro con ID "999" no encontrado'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a book successfully', async () => {
      const mockBook = {
        id: '1',
        title: 'Test Book',
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelize.transaction.mockImplementation((callback) => {
        return callback(mockTransaction);
      });

      mockBookModel.findByPk.mockResolvedValue(mockBook);

      await service.remove('1');

      expect(sequelize.transaction).toHaveBeenCalled();
      expect(bookModel.findByPk).toHaveBeenCalledWith('1', {
        transaction: mockTransaction,
      });
      expect(mockBook.destroy).toHaveBeenCalledWith({
        transaction: mockTransaction,
      });
    });

    it('should throw NotFoundException when book is not found', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelize.transaction.mockImplementation((callback) => {
        return callback(mockTransaction);
      });

      mockBookModel.findByPk.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(
        new NotFoundException('Libro con ID "999" no encontrado'),
      );
    });
  });

  describe('getGenres', () => {
    it('should return all genres', () => {
      const result = service.getGenres();

      // This method returns static data from CMPC_GENRES constant
      expect(result).toEqual(expect.arrayContaining(['Historia Industrial de Chile', 'Tecnología y Procesos Industriales']));
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getPublishers', () => {
    it('should return all publishers', () => {
      const result = service.getPublishers();

      // This method returns static data from Publisher enum
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('CMPC Editorial');
    });
  });

  describe('exportToCSV', () => {
    it('should export books to CSV successfully', async () => {
      const mockBooks = [
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
        {
          id: '2',
          title: 'Book 2',
          author: 'Author 2',
          publisher: 'Publisher 2',
          price: 19.99,
          availability: false,
          genre: 'Non-Fiction',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
      ];

      mockBookModel.findAll.mockResolvedValue(mockBooks);

      const result = await service.exportToCSV();

      expect(bookModel.findAll).toHaveBeenCalledWith({
        order: [['title', 'ASC']],
      });

      expect(result).toContain('ID,Título,Autor,Editorial,Género,Precio (CLP),Stock Actual,Disponible,Descripción,URL Imagen,Fecha Creación,Última Actualización');
      expect(result).toContain('Book 1');
      expect(result).toContain('Book 2');
    });

    it('should handle empty books list', async () => {
      mockBookModel.findAll.mockResolvedValue([]);

      const result = await service.exportToCSV();

      expect(result).toBe('ID,Título,Autor,Editorial,Género,Precio (CLP),Stock Actual,Disponible,Descripción,URL Imagen,Fecha Creación,Última Actualización\n');
    });
  });

});
