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
import { User } from '../../users/entities/user.entity';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, user, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    const startTime = Date.now();

    // Log request details
    this.logger.log(
      `Incoming ${method} ${url} - User: ${user?.id || 'anonymous'} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    if (body && Object.keys(body).length > 0) {
      // Mask sensitive data
      const sanitizedBody = this.sanitizeRequestBody(body);
      this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusCode = response.statusCode;

        // Log successful response
        this.logger.log(
          `Outgoing ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms - User: ${user?.id || 'anonymous'}`,
        );

        // Log response data for debugging (be careful with sensitive data)
        if (process.env.NODE_ENV === 'development') {
          this.logger.debug(`Response Data: ${JSON.stringify(data)}`);
        }
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusCode = error.status || 500;

        // Log error response
        this.logger.error(
          `Error ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms - User: ${user?.id || 'anonymous'} - Error: ${error.message}`,
          error.stack,
        );

        throw error;
      }),
    );
  }

  private sanitizeRequestBody(body: any): any {
    const sensitiveFields = [
      'password',
      'token',
      'refreshToken',
      'secret',
      'key',
    ];
    const sanitized = { ...body };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
