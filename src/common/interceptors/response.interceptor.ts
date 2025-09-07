import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  status: boolean;
  data: T | null;
  message: string;
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // Determinar el mensaje basado en el método HTTP
        const method = request.method;
        const path = request.route?.path || request.url;
        let message = 'Operación exitosa';

        switch (method) {
          case 'GET':
            if (path.includes('/:id')) {
              message = 'Registro encontrado exitosamente';
            } else {
              message = 'Registros obtenidos exitosamente';
            }
            break;
          case 'POST':
            message = 'Registro creado exitosamente';
            break;
          case 'PUT':
          case 'PATCH':
            message = 'Registro actualizado exitosamente';
            break;
          case 'DELETE':
            message = 'Registro eliminado exitosamente';
            break;
        }

        // Estructura base de respuesta
        const responseData: ApiResponse<T> = {
          status: true,
          data: data || null,
          message,
          timestamp: new Date().toISOString(),
          path,
          method,
          statusCode: response.statusCode,
        };

        // Agregar información de paginación si existe
        if (
          data &&
          typeof data === 'object' &&
          'items' in data &&
          'meta' in data
        ) {
          responseData.data = data.items;
          responseData.pagination = {
            page: data.meta.page || 1,
            limit: data.meta.limit || 10,
            total: data.meta.total || 0,
            totalPages: Math.ceil(
              (data.meta.total || 0) / (data.meta.limit || 10),
            ),
          };
        }

        return responseData;
      }),
    );
  }
}

// Interceptor específico para respuestas de error
@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Si es un error, transformarlo a la estructura estándar
        if (data && data.statusCode && data.statusCode >= 400) {
          return {
            status: false,
            data: null,
            message: data.message || 'Error en la operación',
            timestamp: new Date().toISOString(),
            path:
              context.switchToHttp().getRequest().route?.path ||
              context.switchToHttp().getRequest().url,
            method: context.switchToHttp().getRequest().method,
            statusCode: data.statusCode,
            errors: data.errors || [],
          };
        }
        return data;
      }),
    );
  }
}

// Helper para crear respuestas de error consistentes
export class ApiResponseHelper {
  static success<T>(
    data: T,
    message?: string,
    statusCode: number = HttpStatus.OK,
  ): ApiResponse<T> {
    return {
      status: true,
      data,
      message: message || 'Operación exitosa',
      timestamp: new Date().toISOString(),
      path: '',
      method: '',
      statusCode,
    };
  }

  static error(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    errors?: any[],
  ): ApiResponse<null> {
    return {
      status: false,
      data: null,
      message,
      timestamp: new Date().toISOString(),
      path: '',
      method: '',
      statusCode,
      errors,
    };
  }

  static paginated<T>(
    items: T[],
    page: number,
    limit: number,
    total: number,
    message?: string,
  ): ApiResponse<T[]> {
    return {
      status: true,
      data: items,
      message: message || 'Registros obtenidos exitosamente',
      timestamp: new Date().toISOString(),
      path: '',
      method: '',
      statusCode: HttpStatus.OK,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
