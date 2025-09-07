import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto, SortField, SortDirection } from './dto/query-book.dto';
import { Genre } from './enums/genre.enum';
import { Author } from './enums/author.enum';
import { Publisher } from './enums/publisher.enum';
import {
  CMPC_GENRE_DESCRIPTIONS,
  CMPC_SPECIFIC_GENRES,
  TRADITIONAL_GENRES,
} from './constants/cmpc-genres';
import {
  CMPC_AUTHOR_DESCRIPTIONS,
  CMPC_SPECIFIC_AUTHORS,
  TRADITIONAL_AUTHORS,
} from './constants/cmpc-authors';

export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const book = this.bookRepository.create(createBookDto);
      const savedBook = await this.bookRepository.save(book);
      return savedBook;
    } catch {
      throw new BadRequestException('Error creating book');
    }
  }

  async findAll(queryDto: QueryBookDto): Promise<BookListResponse> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        genre,
        publisher,
        author,
        availability,
        sortBy = SortField.TITLE,
        sortDir = SortDirection.ASC,
      } = queryDto;

      const queryBuilder = this.bookRepository
        .createQueryBuilder('book')
        .where('book.deletedAt IS NULL');

      // Aplicar filtros
      if (search) {
        queryBuilder.andWhere('book.title ILIKE :search', {
          search: `%${search}%`,
        });
      }

      if (genre) {
        queryBuilder.andWhere('book.genre = :genre', { genre });
      }

      if (publisher) {
        queryBuilder.andWhere('book.publisher = :publisher', { publisher });
      }

      if (author) {
        queryBuilder.andWhere('book.author ILIKE :author', {
          author: `%${author}%`,
        });
      }

      if (availability !== undefined) {
        queryBuilder.andWhere('book.availability = :availability', {
          availability,
        });
      }

      // Aplicar ordenamiento
      const orderBy = `book.${sortBy}`;
      queryBuilder.orderBy(orderBy, sortDir.toUpperCase() as 'ASC' | 'DESC');

      // Aplicar paginación
      const offset = (page - 1) * limit;
      queryBuilder.skip(offset).take(limit);

      // Ejecutar consulta
      const [books, total] = await queryBuilder.getManyAndCount();

      const totalPages = Math.ceil(total / limit);

      return {
        books,
        total,
        page,
        limit,
        totalPages,
      };
    } catch {
      throw new BadRequestException('Error finding books');
    }
  }

  async findOne(id: string): Promise<Book> {
    try {
      const book = await this.bookRepository.findOne({
        where: { id, deletedAt: null },
      });

      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error finding book');
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    try {
      const book = await this.findOne(id);

      Object.assign(book, updateBookDto);
      const updatedBook = await this.bookRepository.save(book);

      return updatedBook;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error updating book');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.bookRepository.softDelete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error deleting book');
    }
  }

  getGenres(): string[] {
    // Retornar todos los valores del enum de géneros
    return Object.values(Genre);
  }

  getCmpcSpecificGenres(): string[] {
    // Retornar solo los géneros específicos de CMPC
    return CMPC_SPECIFIC_GENRES;
  }

  getTraditionalGenres(): string[] {
    // Retornar solo los géneros tradicionales
    return TRADITIONAL_GENRES;
  }

  getGenreDescriptions() {
    // Retornar géneros con sus descripciones
    return CMPC_GENRE_DESCRIPTIONS;
  }

  getAuthors(): string[] {
    // Retornar todos los valores del enum de autores
    return Object.values(Author);
  }

  getCmpcSpecificAuthors(): string[] {
    // Retornar solo los autores específicos de CMPC
    return CMPC_SPECIFIC_AUTHORS;
  }

  getTraditionalAuthors(): string[] {
    // Retornar solo los autores tradicionales
    return TRADITIONAL_AUTHORS;
  }

  getAuthorDescriptions() {
    // Retornar autores con sus descripciones
    return CMPC_AUTHOR_DESCRIPTIONS;
  }

  getPublishers(): string[] {
    // Retornar todos los valores del enum de editoriales
    return Object.values(Publisher);
  }

  async exportToCSV(): Promise<string> {
    try {
      const books = await this.bookRepository.find({
        where: { deletedAt: null },
        order: { title: 'ASC' },
      });

      const csvHeaders =
        'ID,Título,Autor,Editorial,Precio,Disponibilidad,Género,Stock,Creado\n';
      const csvRows = books
        .map(
          (book) =>
            `${book.id},"${book.title}","${book.author}","${book.publisher}",${book.price},${book.availability},"${book.genre}",${book.stock},${book.createdAt.toISOString()}`,
        )
        .join('\n');

      const csv = csvHeaders + csvRows;
      return csv;
    } catch {
      throw new BadRequestException('Error exporting to CSV');
    }
  }
}
