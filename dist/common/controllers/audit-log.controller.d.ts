import { Response } from 'express';
import { AuditLogService, QueryAuditLogDto } from '../services/audit-log.service';
import { AuditLogAction, AuditLogStatus, AuditLogLevel } from '../entities/audit-log.entity';
export declare class AuditLogController {
    private readonly auditLogService;
    private readonly logger;
    constructor(auditLogService: AuditLogService);
    findAll(queryDto: QueryAuditLogDto): Promise<{
        status: string;
        data: import("../services/audit-log.service").AuditLogListResponse;
        message: string;
    }>;
    getStats(): Promise<{
        status: string;
        data: any;
        message: string;
    }>;
    getActions(): Promise<{
        status: string;
        data: {
            actions: AuditLogAction[];
            statuses: AuditLogStatus[];
            levels: AuditLogLevel[];
        };
        message: string;
    }>;
    exportToCSV(queryDto: QueryAuditLogDto, res: Response): Promise<void>;
    exportInventoryToCSV(queryDto: QueryAuditLogDto, res: Response): Promise<void>;
    getInventoryLogs(queryDto: QueryAuditLogDto): Promise<{
        status: string;
        data: import("../services/audit-log.service").AuditLogListResponse;
        message: string;
    }>;
    getInventoryFilterOptions(): Promise<{
        status: string;
        data: {
            genres: string[];
            publishers: string[];
            authors: string[];
        };
        message: string;
    }>;
    deleteAllLogs(): Promise<{
        status: string;
        data: number;
        message: string;
    }>;
    updateMetadata(): Promise<{
        status: string;
        data: number;
        message: string;
    }>;
    cleanupOldLogs(days?: string): Promise<{
        status: string;
        data: {
            deletedCount: number;
        };
        message: string;
    }>;
}
