import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditLogService } from '../services/audit-log.service';
import { BooksService } from '../../books/books.service';
export declare class AuditLogInterceptor implements NestInterceptor {
    private readonly auditLogService;
    private readonly booksService;
    private readonly logger;
    constructor(auditLogService: AuditLogService, booksService: BooksService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
    private determineAction;
    private determineEntityType;
    private extractEntityId;
    private generateDescription;
    private sanitizeRequestData;
    private sanitizeResponseData;
    private sanitizeHeaders;
    private sanitizeBody;
    private getClientIp;
    private extractBookMetadata;
}
