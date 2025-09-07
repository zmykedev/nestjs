import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import {
  AuditLogService,
  CreateAuditLogDto,
} from '../services/audit-log.service';
import {
  AuditLogAction,
  AuditLogStatus,
  AuditLogLevel,
} from '../entities/audit-log.entity';
import { BooksService } from '../../books/books.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly booksService: BooksService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // Obtener información del usuario si está autenticado
    const user = (request as any).user;
    const userId = user?.id || user?.sub;
    const userEmail = user?.email;
    const userName = user?.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user?.username;

    // Determinar la acción basada en el método HTTP y la ruta
    const action = this.determineAction(request.method, request.route?.path);

    // Si no hay acción específica, no crear log
    if (!action) {
      return next.handle();
    }

    const entityType = this.determineEntityType(request.route?.path);
    const entityId = this.extractEntityId(request.params, request.body);

    // Extraer metadata del libro si es relevante
    const metadata = await this.extractBookMetadata(request, entityType);

    // Crear DTO base para el log
    const auditLogDto: CreateAuditLogDto = {
      user_id: userId,
      user_email: userEmail,
      user_name: userName,
      action,
      entity_type: entityType,
      entity_id: entityId,
      description: this.generateDescription(
        request.method,
        request.route?.path,
        entityType,
        request,
      ),
      request_data: this.sanitizeRequestData(request),
      ip_address: this.getClientIp(request),
      user_agent: request.get('User-Agent'),
      endpoint: request.route?.path || request.url,
      http_method: request.method,
      level: AuditLogLevel.INFO,
      status: AuditLogStatus.PENDING,
      metadata: metadata,
    };

    return next.handle().pipe(
      tap((data) => {
        // Log exitoso
        const responseTime = Date.now() - startTime;
        this.auditLogService.create({
          ...auditLogDto,
          status: AuditLogStatus.SUCCESS,
          response_data: this.sanitizeResponseData(data),
          response_time_ms: responseTime,
        });
      }),
      catchError((error) => {
        // Log de error
        const responseTime = Date.now() - startTime;
        this.auditLogService.create({
          ...auditLogDto,
          status: AuditLogStatus.FAILURE,
          level: AuditLogLevel.ERROR,
          error_message: error.message,
          response_time_ms: responseTime,
        });
        throw error;
      }),
    );
  }

  private determineAction(method: string, path?: string): AuditLogAction {
    // Solo registrar acciones específicas relacionadas con libros
    if (!path?.includes('books')) {
      return null; // No registrar operaciones no relacionadas con libros
    }

    // Excluir operaciones que no queremos registrar
    if (
      path?.includes('/upload-image') ||
      path?.includes('/genres') ||
      path?.includes('/publishers') ||
      path?.includes('/test')
    ) {
      return null; // No registrar estas operaciones
    }

    switch (method) {
      case 'GET':
        if (path?.includes('search')) {
          return AuditLogAction.INVENTORY_SEARCHED;
        }
        return AuditLogAction.INVENTORY_VIEWED;
      case 'POST':
        if (path === '/api/v1/books' || path?.endsWith('/books')) {
          return AuditLogAction.INVENTORY_ADDED;
        }
        if (path?.includes('search')) {
          return AuditLogAction.INVENTORY_SEARCHED;
        }
        return null; // No registrar otros POST
      case 'PUT':
      case 'PATCH':
        if (path?.includes('/books/') && path?.includes('/')) {
          return AuditLogAction.INVENTORY_UPDATED;
        }
        return null;
      case 'DELETE':
        if (path?.includes('/books/') && path?.includes('/')) {
          return AuditLogAction.INVENTORY_REMOVED;
        }
        return null;
      default:
        return null;
    }
  }

  private determineEntityType(path?: string): string {
    if (!path) return 'unknown';

    if (path.includes('books')) return 'Book';
    if (path.includes('users')) return 'User';
    if (path.includes('auth')) return 'Auth';
    if (path.includes('dashboard')) return 'Dashboard';

    return 'unknown';
  }

  private extractEntityId(params: any, body: any): string | undefined {
    // Intentar obtener el ID de los parámetros de la URL
    if (params?.id) return params.id;
    if (params?.bookId) return params.bookId;
    if (params?.userId) return params.userId;

    // Intentar obtener el ID del cuerpo de la petición
    if (body?.id) return body.id;

    return undefined;
  }

  private generateDescription(
    method: string,
    path?: string,
    entityType?: string,
    request?: Request,
  ): string {
    // Solo generar descripciones para libros
    if (entityType !== 'Book') {
      return 'Operación no relacionada con libros';
    }

    // Descripciones específicas para libros
    if (request?.body) {
      const body = request.body;

      if (method === 'POST' && body.title && body.author && body.publisher) {
        return `📚 Libro creado: "${body.title}" por ${body.author} en ${body.publisher}`;
      }

      if (
        (method === 'PUT' || method === 'PATCH') &&
        body.title &&
        body.author &&
        body.publisher
      ) {
        return `✏️ Libro actualizado: "${body.title}" por ${body.author} en ${body.publisher}`;
      }

      if (method === 'DELETE' && body.title) {
        return `🗑️ Libro eliminado: "${body.title}"`;
      }
    }

    // Descripciones basadas en la ruta
    if (path?.includes('search')) {
      return '🔍 Búsqueda de libros realizada';
    }

    if (path?.includes('export')) {
      return '📤 Exportación de libros realizada';
    }

    if (path?.includes('import')) {
      return '📥 Importación de libros realizada';
    }

    if (path?.includes('filter')) {
      return '🔧 Filtrado de libros aplicado';
    }

    if (path?.includes('sort')) {
      return '📊 Ordenamiento de libros aplicado';
    }

    if (path?.includes('page') || path?.includes('limit')) {
      return '📄 Navegación por páginas de libros';
    }

    // Descripción por defecto para libros
    switch (method) {
      case 'GET':
        return '🔍 Visualización de libros';
      case 'POST':
        return '🆕 Creación de nuevo libro';
      case 'PUT':
      case 'PATCH':
        return '🔄 Actualización de libro';
      case 'DELETE':
        return '🗑️ Eliminación de libro';
      default:
        return '📚 Operación en libros';
    }
  }

  private sanitizeRequestData(request: Request): any {
    const data: any = {
      method: request.method,
      url: request.url,
      headers: this.sanitizeHeaders(request.headers),
    };

    // Incluir parámetros de consulta si existen
    if (Object.keys(request.query).length > 0) {
      data.query = request.query;
    }

    // Incluir parámetros de ruta si existen
    if (Object.keys(request.params).length > 0) {
      data.params = request.params;
    }

    // Incluir cuerpo de la petición si existe (excluir contraseñas)
    if (request.body && Object.keys(request.body).length > 0) {
      data.body = this.sanitizeBody(request.body);
    }

    return data;
  }

  private sanitizeResponseData(data: any): any {
    if (!data) return null;

    // Si es una respuesta paginada, incluir solo metadatos
    if (data.books && Array.isArray(data.books)) {
      return {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        itemsCount: data.books.length,
      };
    }

    // Si es un array, incluir solo el conteo
    if (Array.isArray(data)) {
      return {
        itemsCount: data.length,
        type: 'array',
      };
    }

    // Si es un objeto simple, incluir solo las claves principales
    if (typeof data === 'object') {
      const sanitized: any = {};
      Object.keys(data).forEach((key) => {
        if (
          typeof data[key] !== 'function' &&
          key !== 'password' &&
          key !== 'token'
        ) {
          if (typeof data[key] === 'object' && data[key] !== null) {
            sanitized[key] = 'object';
          } else {
            sanitized[key] = data[key];
          }
        }
      });
      return sanitized;
    }

    return data;
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized: any = {};
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    Object.keys(headers).forEach((key) => {
      if (!sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = headers[key];
      } else {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitized: any = {};
    const sensitiveFields = ['password', 'token', 'refreshToken', 'apiKey'];

    Object.keys(body).forEach((key) => {
      if (sensitiveFields.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof body[key] === 'object' && body[key] !== null) {
        sanitized[key] = this.sanitizeBody(body[key]);
      } else {
        sanitized[key] = body[key];
      }
    });

    return sanitized;
  }

  private getClientIp(request: Request): string {
    return (request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown') as string;
  }

  private async extractBookMetadata(
    request: Request,
    entityType?: string,
  ): Promise<any> {
    this.logger.debug(
      `Extracting metadata for ${request?.method} ${request?.url}, entityType=${entityType}`,
    );

    if (entityType !== 'Book') {
      this.logger.debug(`No metadata extracted: entityType=${entityType}`);
      return null;
    }

    // Para operaciones DELETE, obtener datos del libro desde la base de datos
    if (request?.method === 'DELETE' && request?.params?.id) {
      this.logger.debug(
        `DELETE operation detected, book ID: ${request.params.id}`,
      );
      try {
        const book = await this.booksService.findOne(request.params.id);
        this.logger.debug(`Book found: ${book ? 'YES' : 'NO'}`);
        if (book) {
          const metadata = {
            title: book.title || null,
            author: book.author || null,
            publisher: book.publisher || null,
            genre: book.genre || null,
            stock: book.stock || null,
            price: book.price || null,
            description: book.description || null,
          };
          this.logger.debug(
            `Book metadata extracted from DB for DELETE: ${JSON.stringify(metadata)}`,
          );
          return metadata;
        } else {
          this.logger.warn(
            `Book with ID ${request.params.id} not found in database`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Error fetching book data for DELETE operation: ${error.message}`,
        );
        this.logger.error(`Error stack: ${error.stack}`);
      }
    }

    // Para otras operaciones, usar datos del body
    if (request?.body && Object.keys(request.body).length > 0) {
      const bookData = request.body;
      const metadata = {
        title: bookData.title || null,
        author: bookData.author || null,
        publisher: bookData.publisher || null,
        genre: bookData.genre || null,
        stock: bookData.stock || null,
        price: bookData.price || null,
        description: bookData.description || null,
      };
      this.logger.debug(
        `Book metadata extracted from body: ${JSON.stringify(metadata)}`,
      );
      return metadata;
    }

    this.logger.debug(`No book data found for ${request?.method} operation`);
    return null;
  }
}
