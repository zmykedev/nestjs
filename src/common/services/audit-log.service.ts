import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AuditLog,
  AuditLogAction,
  AuditLogStatus,
  AuditLogLevel,
} from '../entities/audit-log.entity';

export interface CreateAuditLogDto {
  user_id?: string;
  user_email?: string;
  user_name?: string;
  action: AuditLogAction;
  entity_type?: string;
  entity_id?: string;
  description?: string;
  request_data?: any;
  response_data?: any;
  status?: AuditLogStatus;
  level?: AuditLogLevel;
  ip_address?: string;
  user_agent?: string;
  endpoint?: string;
  http_method?: string;
  response_time_ms?: number;
  error_message?: string;
  metadata?: any;
}

export interface QueryAuditLogDto {
  page?: number;
  limit?: number;
  user_id?: string;
  action?: AuditLogAction;
  entity_type?: string;
  entity_id?: string;
  status?: AuditLogStatus;
  level?: AuditLogLevel;
  start_date?: string;
  end_date?: string;
  search?: string;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
  // Filtros específicos para inventario de libros
  author?: string;
  publisher?: string;
  genre?: string;
}

export interface AuditLogListResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    try {
      const auditLog = this.auditLogRepository.create(createAuditLogDto);
      const savedLog = await this.auditLogRepository.save(auditLog);

      this.logger.debug(
        `Audit log created: ${savedLog.id} - ${savedLog.action}`,
      );
      return savedLog;
    } catch (error) {
      this.logger.error(`Error creating audit log: ${error.message}`);
      throw error;
    }
  }

  async findAll(queryDto: QueryAuditLogDto): Promise<AuditLogListResponse> {
    try {
      const {
        page = 1,
        limit = 50,
        user_id,
        action,
        entity_type,
        entity_id,
        status,
        level,
        start_date,
        end_date,
        search,
        sort_by = 'created_at',
        sort_dir = 'DESC',
        author,
        publisher,
        genre,
      } = queryDto;

      const queryBuilder = this.auditLogRepository
        .createQueryBuilder('log')
        .leftJoin('books', 'book', 'book.id::text = log.entity_id')
        .where('log.deleted_at IS NULL');

      // Aplicar filtros
      if (user_id) {
        queryBuilder.andWhere('log.user_id = :user_id', { user_id });
      }

      if (action) {
        queryBuilder.andWhere('log.action = :action', { action });
      }

      if (entity_type) {
        queryBuilder.andWhere('log.entity_type = :entity_type', {
          entity_type,
        });
      }

      if (entity_id) {
        queryBuilder.andWhere('log.entity_id = :entity_id', { entity_id });
      }

      if (status) {
        queryBuilder.andWhere('log.status = :status', { status });
      }

      if (level) {
        queryBuilder.andWhere('log.level = :level', { level });
      }

      if (start_date) {
        queryBuilder.andWhere('log.created_at >= :start_date', { start_date });
      }

      if (end_date) {
        queryBuilder.andWhere('log.created_at <= :end_date', { end_date });
      }

      if (search) {
        queryBuilder.andWhere(
          '(log.description ILIKE :search OR log.user_name ILIKE :search OR log.user_email ILIKE :search OR book.title ILIKE :search OR book.author ILIKE :search OR book.publisher ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      // Filtros específicos para inventario de libros
      // Usar metadata cuando no hay entity_id, o JOIN cuando sí hay
      if (author) {
        queryBuilder.andWhere(
          '(book.author ILIKE :author OR log.metadata->>\'author\' ILIKE :author)',
          { author: `%${author}%` }
        );
      }

      if (publisher) {
        queryBuilder.andWhere(
          '(book.publisher ILIKE :publisher OR log.metadata->>\'publisher\' ILIKE :publisher)',
          { publisher: `%${publisher}%` }
        );
      }

      if (genre) {
        queryBuilder.andWhere(
          '(book.genre ILIKE :genre OR log.metadata->>\'genre\' ILIKE :genre)',
          { genre: `%${genre}%` }
        );
      }

      // Aplicar ordenamiento
      const orderBy = `log.${sort_by}`;
      queryBuilder.orderBy(orderBy, sort_dir.toUpperCase() as 'ASC' | 'DESC');

      // Aplicar paginación
      const offset = (page - 1) * limit;
      queryBuilder.skip(offset).take(limit);

      // Ejecutar consulta
      const [logs, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(total / limit);

      return {
        logs,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error(`Error finding audit logs: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: number): Promise<AuditLog> {
    try {
      const log = await this.auditLogRepository.findOne({
        where: { id, deleted_at: null },
      });

      if (!log) {
        throw new Error(`Audit log with ID ${id} not found`);
      }

      return log;
    } catch (error) {
      this.logger.error(`Error finding audit log: ${error.message}`);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const totalLogs = await this.auditLogRepository.count({
        where: { deleted_at: null },
      });

      const logsByAction = await this.auditLogRepository
        .createQueryBuilder('log')
        .select('log.action', 'action')
        .addSelect('COUNT(*)', 'count')
        .where('log.deleted_at IS NULL')
        .groupBy('log.action')
        .getRawMany();

      const logsByStatus = await this.auditLogRepository
        .createQueryBuilder('log')
        .select('log.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('log.deleted_at IS NULL')
        .groupBy('log.status')
        .getRawMany();

      const logsByLevel = await this.auditLogRepository
        .createQueryBuilder('log')
        .select('log.level', 'level')
        .addSelect('COUNT(*)', 'count')
        .where('log.deleted_at IS NULL')
        .groupBy('log.level')
        .getRawMany();

      const recentActivity = await this.auditLogRepository
        .createQueryBuilder('log')
        .select([
          'log.action',
          'log.entity_type',
          'log.user_name',
          'log.created_at',
          'log.status',
        ])
        .where('log.deleted_at IS NULL')
        .orderBy('log.created_at', 'DESC')
        .limit(10)
        .getMany();

      return {
        totalLogs,
        logsByAction,
        logsByStatus,
        logsByLevel,
        recentActivity,
      };
    } catch (error) {
      this.logger.error(`Error getting audit log stats: ${error.message}`);
      throw error;
    }
  }

  async exportToCSV(queryDto: QueryAuditLogDto): Promise<string> {
    try {
      const { logs } = await this.findAll({ ...queryDto, limit: 10000 });

      const csvHeaders =
        'ID,Usuario,Acción,Entidad,Descripción,Estado,Nivel,IP,Endpoint,Método HTTP,Tiempo Respuesta,Fecha Creación\n';
      const csvRows = logs
        .map(
          (log) =>
            `${log.id},"${log.user_name || 'N/A'}","${log.action}","${log.entity_type || 'N/A'}","${log.description || 'N/A'}","${log.status}","${log.level}","${log.ip_address || 'N/A'}","${log.endpoint || 'N/A'}","${log.http_method || 'N/A'}","${log.response_time_ms || 'N/A'}","${log.created_at.toISOString()}"`,
        )
        .join('\n');

      return csvHeaders + csvRows;
    } catch (error) {
      this.logger.error(`Error exporting audit logs to CSV: ${error.message}`);
      throw error;
    }
  }

  async getInventoryFilterOptions(): Promise<{
    genres: string[];
    publishers: string[];
    authors: string[];
  }> {
    try {
      // Obtener géneros únicos de la tabla books
      const genres = await this.auditLogRepository.manager
        .createQueryBuilder()
        .select('DISTINCT book.genre', 'genre')
        .from('books', 'book')
        .where('book."deletedAt" IS NULL')
        .andWhere('book.genre IS NOT NULL')
        .andWhere('book.genre != :empty', { empty: '' })
        .orderBy('book.genre', 'ASC')
        .getRawMany();

      // Obtener editoriales únicas de la tabla books
      const publishers = await this.auditLogRepository.manager
        .createQueryBuilder()
        .select('DISTINCT book.publisher', 'publisher')
        .from('books', 'book')
        .where('book."deletedAt" IS NULL')
        .andWhere('book.publisher IS NOT NULL')
        .andWhere('book.publisher != :empty', { empty: '' })
        .orderBy('book.publisher', 'ASC')
        .getRawMany();

      // Obtener autores únicos de la tabla books
      const authors = await this.auditLogRepository.manager
        .createQueryBuilder()
        .select('DISTINCT book.author', 'author')
        .from('books', 'book')
        .where('book."deletedAt" IS NULL')
        .andWhere('book.author IS NOT NULL')
        .andWhere('book.author != :empty', { empty: '' })
        .orderBy('book.author', 'ASC')
        .getRawMany();

      return {
        genres: genres.map(item => item.genre).filter(Boolean),
        publishers: publishers.map(item => item.publisher).filter(Boolean),
        authors: authors.map(item => item.author).filter(Boolean),
      };
    } catch (error) {
      this.logger.error(`Error getting inventory filter options: ${error.message}`);
      throw error;
    }
  }


  async exportInventoryToCSV(queryDto: QueryAuditLogDto): Promise<string> {
    try {
      // Filtrar solo logs de inventario de libros
      const inventoryQuery = {
        ...queryDto,
        entity_type: 'Book',
        action: queryDto.action || undefined,
        limit: 10000,
      };

      const { logs } = await this.findAll(inventoryQuery);

      // Headers específicos para inventario de libros
      const csvHeaders =
        'ID,Usuario,Acción,Título del Libro,Autor,Editorial,Género,Stock,Precio,Descripción,Estado,Fecha y Hora,IP,Endpoint\n';

      const csvRows = logs
        .map((log) => {
          // Extraer metadata del libro
          const metadata = log.metadata || {};
          const title = metadata.title || '';
          const author = metadata.author || '';
          const publisher = metadata.publisher || '';
          const genre = metadata.genre || '';
          const stock = metadata.stock || '';
          const price = metadata.price || '';
          const description = metadata.description || '';

          // Generar descripción de acción más descriptiva
          let actionDescription = '';
          switch (log.action) {
            case 'INVENTORY_ADDED':
              actionDescription = title
                ? `Libro "${title}" agregado al inventario`
                : 'Nuevo libro agregado al inventario';
              break;
            case 'INVENTORY_UPDATED':
              actionDescription = title
                ? `Libro "${title}" actualizado`
                : 'Libro actualizado en el inventario';
              break;
            case 'INVENTORY_REMOVED':
              actionDescription = title
                ? `Libro "${title}" eliminado del inventario`
                : 'Libro eliminado del inventario';
              break;
            case 'INVENTORY_VIEWED':
              actionDescription = title
                ? `Libro "${title}" visualizado`
                : 'Consulta de inventario realizada';
              break;
            case 'INVENTORY_SEARCHED':
              actionDescription = 'Búsqueda en inventario realizada';
              break;
            default:
              actionDescription = log.description || 'Acción realizada';
          }

          return `${log.id},"${log.user_name || 'N/A'}","${actionDescription}","${title}","${author}","${publisher}","${genre}","${stock}","${price}","${description}","${log.status}","${log.created_at.toISOString()}","${log.ip_address || 'N/A'}","${log.endpoint || 'N/A'}"`;
        })
        .join('\n');

      return csvHeaders + csvRows;
    } catch (error) {
      this.logger.error(
        `Error exporting inventory audit logs to CSV: ${error.message}`,
      );
      throw error;
    }
  }

  async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await this.auditLogRepository
        .createQueryBuilder()
        .delete()
        .from(AuditLog)
        .where('created_at < :cutoffDate', { cutoffDate })
        .execute();

      this.logger.log(
        `Cleaned up ${result.affected} old audit logs older than ${daysToKeep} days`,
      );
      return result.affected || 0;
    } catch (error) {
      this.logger.error(`Error cleaning up old audit logs: ${error.message}`);
      throw error;
    }
  }

  async deleteAllLogs(): Promise<number> {
    try {
      const result = await this.auditLogRepository
        .createQueryBuilder()
        .delete()
        .from(AuditLog)
        .execute();

      this.logger.log(`Deleted all ${result.affected} audit logs`);
      return result.affected || 0;
    } catch (error) {
      this.logger.error(`Error deleting all audit logs: ${error.message}`);
      throw error;
    }
  }

  async updateMetadataForExistingLogs(): Promise<number> {
    try {
      // Buscar logs que no tienen metadata pero sí tienen request_data
      const logsWithoutMetadata = await this.auditLogRepository
        .createQueryBuilder('log')
        .where('log.deleted_at IS NULL')
        .andWhere('log.entity_type = :entityType', { entityType: 'Book' })
        .andWhere("(log.metadata IS NULL OR log.metadata = '{}')")
        .andWhere('log.request_data IS NOT NULL')
        .getMany();

      let updatedCount = 0;

      for (const log of logsWithoutMetadata) {
        try {
          const requestData = log.request_data;
          if (requestData && requestData.body) {
            const body = requestData.body;
            const metadata = {
              title: body.title || null,
              author: body.author || null,
              publisher: body.publisher || null,
              genre: body.genre || null,
              stock: body.stock || null,
              price: body.price || null,
              description: body.description || null,
            };

            await this.auditLogRepository
              .createQueryBuilder()
              .update(AuditLog)
              .set({ metadata })
              .where('id = :id', { id: log.id })
              .execute();

            updatedCount++;
          }
        } catch (error) {
          this.logger.warn(
            `Error updating metadata for log ${log.id}: ${error.message}`,
          );
        }
      }

      this.logger.log(`Updated metadata for ${updatedCount} audit logs`);
      return updatedCount;
    } catch (error) {
      this.logger.error(
        `Error updating metadata for existing logs: ${error.message}`,
      );
      throw error;
    }
  }
}
