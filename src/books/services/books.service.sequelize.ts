import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Book } from '../models/book.model';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookQueryDto } from '../dto/book-query.dto';
import { CMPC_GENRES, TRADITIONAL_GENRES } from '../constants/cmpc-genres';
import {
  CMPC_AUTHORS,
  TRADITIONAL_AUTHORS,
  CMPC_AUTHOR_DESCRIPTIONS,
} from '../constants/cmpc-authors';
import { Publisher } from '../enums/publisher.enum';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private readonly bookModel: typeof Book,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Crear libro con transacción automática
   */
  async create(createBookDto: CreateBookDto): Promise<Book> {
    return await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const book = await this.bookModel.create(createBookDto, {
            transaction,
          });

          console.log(`✅ Libro creado: "${book.title}" con ID: ${book.id}`);

          return book;
        } catch (error) {
          console.error('❌ Error creando libro:', error);
          throw new BadRequestException('Error al crear el libro');
        }
      },
    );
  }

  /**
   * Buscar libros con filtros avanzados (Query Builder estilo Sequelize)
   */
  async findAll(query: BookQueryDto): Promise<{
    books: Book[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      author,
      genre,
      publisher,
      priceMin,
      priceMax,
      availability,
      sortBy = 'title',
      sortDir = 'asc',
      page = 1,
      limit = 10,
    } = query;

    // Construir condiciones WHERE dinámicamente
    const whereConditions: any = {};

    // Búsqueda de texto
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Filtros específicos
    if (author) {
      whereConditions.author = { [Op.iLike]: `%${author}%` };
    }

    if (genre) {
      whereConditions.genre = genre;
    }

    if (publisher) {
      whereConditions.publisher = publisher;
    }

    if (availability !== undefined) {
      whereConditions.availability = availability;
    }

    // Filtro de precio
    if (priceMin !== undefined || priceMax !== undefined) {
      whereConditions.price = {};
      if (priceMin !== undefined) {
        whereConditions.price[Op.gte] = priceMin;
      }
      if (priceMax !== undefined) {
        whereConditions.price[Op.lte] = priceMax;
      }
    }

    // Configurar ordenamiento
    const orderField = this.getValidSortField(sortBy);
    const orderDirection = sortDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    try {
      // Ejecutar consulta con paginación
      const { count, rows } = await this.bookModel.findAndCountAll({
        where: whereConditions,
        order: [[orderField, orderDirection]],
        limit: Math.min(limit, 100), // Máximo 100 items
        offset: (page - 1) * limit,
        // paranoid: true, // Will be enabled after migration adds deleted_at
      });

      const totalPages = Math.ceil(count / limit);

      console.log(
        `📊 Consulta ejecutada: ${count} libros encontrados, página ${page}/${totalPages}`,
      );

      return {
        books: rows,
        total: count,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('❌ Error en consulta de libros:', error);
      throw new BadRequestException('Error al buscar libros');
    }
  }

  /**
   * Buscar libro por ID
   */
  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findByPk(id);

    if (!book) {
      throw new NotFoundException(`Libro con ID "${id}" no encontrado`);
    }

    return book;
  }

  /**
   * Actualizar libro con transacción
   */
  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    return await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const book = await this.bookModel.findByPk(id, { transaction });

        if (!book) {
          throw new NotFoundException(`Libro con ID "${id}" no encontrado`);
        }

        try {
          await book.update(updateBookDto, { transaction });

          console.log(`✅ Libro actualizado: "${book.title}" (ID: ${id})`);

          return book;
        } catch (error) {
          console.error('❌ Error actualizando libro:', error);
          throw new BadRequestException('Error al actualizar el libro');
        }
      },
    );
  }

  /**
   * Eliminar libro (soft delete)
   */
  async remove(id: string): Promise<void> {
    return await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const book = await this.bookModel.findByPk(id, { transaction });

        if (!book) {
          throw new NotFoundException(`Libro con ID "${id}" no encontrado`);
        }

        try {
          await book.destroy({ transaction }); // Soft delete automático

          console.log(`🗑️ Libro eliminado: "${book.title}" (ID: ${id})`);
        } catch (error) {
          console.error('❌ Error eliminando libro:', error);
          throw new BadRequestException('Error al eliminar el libro');
        }
      },
    );
  }

  /**
   * Exportar a CSV con Sequelize
   */
  async exportToCSV(): Promise<string> {
    try {
      const books = await this.bookModel.findAll({
        order: [['title', 'ASC']],
        // paranoid: true, // Will be enabled after migration adds deleted_at
      });

      // Headers comprensivos
      const csvHeaders =
        [
          'ID',
          'Título',
          'Autor',
          'Editorial',
          'Género',
          'Precio (CLP)',
          'Stock Actual',
          'Disponible',
          'Descripción',
          'URL Imagen',
          'Fecha Creación',
          'Última Actualización',
        ].join(',') + '\n';

      // Función para escapar campos CSV
      const escapeCSVField = (field: any): string => {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        if (
          stringField.includes('"') ||
          stringField.includes(',') ||
          stringField.includes('\n') ||
          stringField.includes('\r')
        ) {
          return '"' + stringField.replace(/"/g, '""') + '"';
        }
        return stringField;
      };

      // Formatear filas
      const csvRows = books
        .map((book) => {
          return [
            escapeCSVField(book.id),
            escapeCSVField(book.title),
            escapeCSVField(book.author),
            escapeCSVField(book.publisher),
            escapeCSVField(book.genre),
            escapeCSVField(book.formattedPrice), // Usando getter del modelo
            escapeCSVField(book.stock || 0),
            escapeCSVField(book.availability ? 'Sí' : 'No'),
            escapeCSVField(book.description || ''),
            escapeCSVField(book.imageUrl || ''),
            escapeCSVField(book.createdAt.toLocaleDateString('es-CL')),
            escapeCSVField(book.updatedAt.toLocaleDateString('es-CL')),
          ].join(',');
        })
        .join('\n');

      const csv = csvHeaders + csvRows;

      console.log(
        `📊 CSV Export: ${books.length} libros exportados con Sequelize`,
      );

      return csv;
    } catch (error) {
      console.error('❌ Error exporting books to CSV:', error);
      throw new BadRequestException('Error al exportar libros a CSV');
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

  private getValidSortField(field: string): string {
    const validFields = [
      'title',
      'author',
      'publisher',
      'price',
      'genre',
      'createdAt',
      'updatedAt',
    ];
    return validFields.includes(field) ? field : 'title';
  }

  // ===== MÉTODOS DE CONSTANTES (igual que antes) =====

  getGenres(): string[] {
    return [...CMPC_GENRES, ...TRADITIONAL_GENRES];
  }

  getCmpcSpecificGenres(): string[] {
    return CMPC_GENRES;
  }

  getTraditionalGenres(): string[] {
    return TRADITIONAL_GENRES;
  }

  getGenreDescriptions() {
    return {
      cmpc: CMPC_GENRES.map((genre) => ({
        name: genre,
        description: `Género específico de CMPC: ${genre}`,
        category: 'Empresarial',
      })),
      traditional: TRADITIONAL_GENRES.map((genre) => ({
        name: genre,
        description: `Género tradicional: ${genre}`,
        category: 'General',
      })),
    };
  }

  getAuthors(): string[] {
    return [...CMPC_AUTHORS, ...TRADITIONAL_AUTHORS];
  }

  getCmpcSpecificAuthors(): string[] {
    return CMPC_AUTHORS;
  }

  getTraditionalAuthors(): string[] {
    return TRADITIONAL_AUTHORS;
  }

  getAuthorDescriptions() {
    return CMPC_AUTHOR_DESCRIPTIONS;
  }

  getPublishers(): string[] {
    return Object.values(Publisher);
  }

  // ===== MÉTODOS AVANZADOS CON SEQUELIZE =====

  /**
   * Buscar libros con joins y agregaciones
   */
  async getStatistics(): Promise<any> {
    try {
      const stats = await this.bookModel.findAll({
        attributes: [
          'genre',
          [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
          [this.sequelize.fn('AVG', this.sequelize.col('price')), 'avgPrice'],
          [this.sequelize.fn('SUM', this.sequelize.col('stock')), 'totalStock'],
        ],
        group: ['genre'],
        order: [[this.sequelize.fn('COUNT', this.sequelize.col('id')), 'DESC']],
      });

      return stats;
    } catch (error) {
      throw new BadRequestException('Error al obtener estadísticas');
    }
  }

  /**
   * Bulk operations con transacciones
   */
  async bulkUpdatePrices(
    updates: { id: string; price: number }[],
  ): Promise<void> {
    await this.sequelize.transaction(async (transaction: Transaction) => {
      for (const update of updates) {
        await this.bookModel.update(
          { price: update.price },
          {
            where: { id: update.id },
            transaction,
          },
        );
      }
    });
  }
}
