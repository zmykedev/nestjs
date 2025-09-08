import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  AuditLog,
  AuditLogAction,
  AuditLogStatus,
  AuditLogLevel,
} from '../models/audit-log.model';

export interface CreateAuditLogDto {
  user_id?: number;
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
  user_id?: number;
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
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    try {
      const auditLog = await this.auditLogModel.create(createAuditLogDto);

      this.logger.debug(
        `Audit log created: ${auditLog.id} - ${auditLog.action}`,
      );
      return auditLog as AuditLog;
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
        sort_by = 'createdAt',
        sort_dir = 'DESC',
        author,
        publisher,
        genre,
      } = queryDto;

      // Construir condiciones WHERE dinámicamente
      const whereConditions: any = {};

      if (user_id) {
        whereConditions.user_id = user_id;
      }

      if (action) {
        whereConditions.action = action;
      }

      if (entity_type) {
        whereConditions.entity_type = entity_type;
      }

      if (entity_id) {
        whereConditions.entity_id = entity_id;
      }

      if (status) {
        whereConditions.status = status;
      }

      if (level) {
        whereConditions.level = level;
      }

      if (start_date) {
        whereConditions.createdAt = {
          ...whereConditions.createdAt,
          [Op.gte]: new Date(start_date),
        };
      }

      if (end_date) {
        whereConditions.createdAt = {
          ...whereConditions.createdAt,
          [Op.lte]: new Date(end_date),
        };
      }

      if (search) {
        whereConditions[Op.or] = [
          { description: { [Op.iLike]: `%${search}%` } },
          { user_name: { [Op.iLike]: `%${search}%` } },
          { user_email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Filtros específicos para inventario de libros usando metadata
      if (author) {
        whereConditions[Op.and] = [
          ...(whereConditions[Op.and] || []),
          this.sequelize.where(
            this.sequelize.cast(this.sequelize.col('metadata'), 'text'),
            { [Op.iLike]: `%"author"%${author}%` },
          ),
        ];
      }

      if (publisher) {
        whereConditions[Op.and] = [
          ...(whereConditions[Op.and] || []),
          this.sequelize.where(
            this.sequelize.cast(this.sequelize.col('metadata'), 'text'),
            { [Op.iLike]: `%"publisher"%${publisher}%` },
          ),
        ];
      }

      if (genre) {
        whereConditions[Op.and] = [
          ...(whereConditions[Op.and] || []),
          this.sequelize.where(
            this.sequelize.cast(this.sequelize.col('metadata'), 'text'),
            { [Op.iLike]: `%"genre"%${genre}%` },
          ),
        ];
      }

      // Configurar ordenamiento
      const orderField = this.getValidSortField(sort_by);
      const orderDirection = sort_dir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      // Ejecutar consulta con paginación
      const { count, rows } = await this.auditLogModel.findAndCountAll({
        where: whereConditions,
        order: [[orderField, orderDirection]],
        limit: Math.min(limit, 100), // Máximo 100 items
        offset: (page - 1) * limit,
        // paranoid: true, // Will be enabled after migration adds deleted_at
      });

      const totalPages = Math.ceil(count / limit);

      // Transform the data to match frontend expectations
      const transformedLogs = rows.map((log) => ({
        ...log.toJSON(),
        created_at: log.createdAt,
        updated_at: log.updatedAt,
      }));

      return {
        logs: transformedLogs as any[],
        total: count,
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
      const log = await this.auditLogModel.findByPk(id);

      if (!log) {
        throw new Error(`Audit log with ID ${id} not found`);
      }

      return log as AuditLog;
    } catch (error) {
      this.logger.error(`Error finding audit log: ${error.message}`);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const totalLogs = await this.auditLogModel.count();

      const logsByAction = await this.auditLogModel.findAll({
        attributes: [
          'action',
          [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
        ],
        group: ['action'],
        raw: true,
      });

      const logsByStatus = await this.auditLogModel.findAll({
        attributes: [
          'status',
          [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
        ],
        group: ['status'],
        raw: true,
      });

      const logsByLevel = await this.auditLogModel.findAll({
        attributes: [
          'level',
          [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
        ],
        group: ['level'],
        raw: true,
      });

      const recentActivityRows = await this.auditLogModel.findAll({
        attributes: [
          'action',
          'entity_type',
          'user_name',
          'createdAt',
          'status',
        ],
        order: [['createdAt', 'DESC']],
        limit: 10,
      });

      // Transform recentActivity to match frontend expectations
      const recentActivity = recentActivityRows.map((log) => ({
        ...log.toJSON(),
        created_at: log.createdAt,
        createdAt: log.createdAt, // Keep both for compatibility
      }));

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

      const escapeCSVField = (field: any): string => {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        if (
          stringField.includes('"') ||
          stringField.includes(',') ||
          stringField.includes('\n')
        ) {
          return '"' + stringField.replace(/"/g, '""') + '"';
        }
        return stringField;
      };

      const csvRows = logs
        .map((log) => {
          return [
            escapeCSVField(log.id),
            escapeCSVField(log.user_name || 'N/A'),
            escapeCSVField(log.action),
            escapeCSVField(log.entity_type || 'N/A'),
            escapeCSVField(log.description || 'N/A'),
            escapeCSVField(log.status),
            escapeCSVField(log.level),
            escapeCSVField(log.ip_address || 'N/A'),
            escapeCSVField(log.endpoint || 'N/A'),
            escapeCSVField(log.http_method || 'N/A'),
            escapeCSVField(log.response_time_ms || 'N/A'),
            escapeCSVField((log as any).created_at || log.createdAt),
          ].join(',');
        })
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
      // Obtener géneros únicos usando consulta SQL directa
      const genres = await this.sequelize.query(
        `SELECT DISTINCT books.genre as genre 
         FROM books 
         WHERE books."deletedAt" IS NULL 
         AND books.genre IS NOT NULL 
         AND books.genre != '' 
         ORDER BY books.genre ASC`,
        { type: QueryTypes.SELECT },
      );

      const publishers = await this.sequelize.query(
        `SELECT DISTINCT books.publisher as publisher 
         FROM books 
         WHERE books."deletedAt" IS NULL 
         AND books.publisher IS NOT NULL 
         AND books.publisher != '' 
         ORDER BY books.publisher ASC`,
        { type: QueryTypes.SELECT },
      );

      const authors = await this.sequelize.query(
        `SELECT DISTINCT books.author as author 
         FROM books 
         WHERE books."deletedAt" IS NULL 
         AND books.author IS NOT NULL 
         AND books.author != '' 
         ORDER BY books.author ASC`,
        { type: QueryTypes.SELECT },
      );

      return {
        genres: (genres as any[]).map((item) => item.genre).filter(Boolean),
        publishers: (publishers as any[])
          .map((item) => item.publisher)
          .filter(Boolean),
        authors: (authors as any[]).map((item) => item.author).filter(Boolean),
      };
    } catch (error) {
      this.logger.error(
        `Error getting inventory filter options: ${error.message}`,
      );
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

      const escapeCSVField = (field: any): string => {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        if (
          stringField.includes('"') ||
          stringField.includes(',') ||
          stringField.includes('\n')
        ) {
          return '"' + stringField.replace(/"/g, '""') + '"';
        }
        return stringField;
      };

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
            case AuditLogAction.INVENTORY_ADDED:
              actionDescription = title
                ? `Libro "${title}" agregado al inventario`
                : 'Nuevo libro agregado al inventario';
              break;
            case AuditLogAction.INVENTORY_UPDATED:
              actionDescription = title
                ? `Libro "${title}" actualizado`
                : 'Libro actualizado en el inventario';
              break;
            case AuditLogAction.INVENTORY_REMOVED:
              actionDescription = title
                ? `Libro "${title}" eliminado del inventario`
                : 'Libro eliminado del inventario';
              break;
            case AuditLogAction.INVENTORY_VIEWED:
              actionDescription = title
                ? `Libro "${title}" visualizado`
                : 'Consulta de inventario realizada';
              break;
            case AuditLogAction.INVENTORY_SEARCHED:
              actionDescription = 'Búsqueda en inventario realizada';
              break;
            default:
              actionDescription = log.description || 'Acción realizada';
          }

          return [
            escapeCSVField(log.id),
            escapeCSVField(log.user_name || 'N/A'),
            escapeCSVField(actionDescription),
            escapeCSVField(title),
            escapeCSVField(author),
            escapeCSVField(publisher),
            escapeCSVField(genre),
            escapeCSVField(stock),
            escapeCSVField(price),
            escapeCSVField(description),
            escapeCSVField(log.status),
            escapeCSVField((log as any).created_at || log.createdAt),
            escapeCSVField(log.ip_address || 'N/A'),
            escapeCSVField(log.endpoint || 'N/A'),
          ].join(',');
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

      const result = await this.auditLogModel.destroy({
        where: {
          createdAt: {
            [Op.lt]: cutoffDate,
          },
        },
        force: true, // Hard delete
      });

      this.logger.log(
        `Cleaned up ${result} old audit logs older than ${daysToKeep} days`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Error cleaning up old audit logs: ${error.message}`);
      throw error;
    }
  }

  async deleteAllLogs(): Promise<number> {
    try {
      const result = await this.auditLogModel.destroy({
        where: {},
        force: true, // Hard delete
      });

      this.logger.log(`Deleted all ${result} audit logs`);
      return result;
    } catch (error) {
      this.logger.error(`Error deleting all audit logs: ${error.message}`);
      throw error;
    }
  }

  async updateMetadataForExistingLogs(): Promise<number> {
    try {
      // Buscar logs que no tienen metadata pero sí tienen request_data
      const logsWithoutMetadata = await this.auditLogModel.findAll({
        where: {
          entity_type: 'Book',
          [Op.or]: [{ metadata: null }, { metadata: {} }],
          request_data: {
            [Op.ne]: null,
          },
        },
      });

      let updatedCount = 0;

      for (const log of logsWithoutMetadata) {
        try {
          const requestData = (log as any).request_data;
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

            await log.update({ metadata });
            updatedCount++;
          }
        } catch (error) {
          this.logger.warn(
            `Error updating metadata for log ${(log as any).id}: ${error.message}`,
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

  private getValidSortField(field: string): string {
    const validFields = [
      'id',
      'action',
      'entity_type',
      'status',
      'level',
      'createdAt',
      'updatedAt',
    ];
    return validFields.includes(field) ? field : 'createdAt';
  }
}
