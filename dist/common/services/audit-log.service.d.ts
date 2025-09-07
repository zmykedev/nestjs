import { Repository } from 'typeorm';
import { AuditLog, AuditLogAction, AuditLogStatus, AuditLogLevel } from '../entities/audit-log.entity';
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
export declare class AuditLogService {
    private readonly auditLogRepository;
    private readonly logger;
    constructor(auditLogRepository: Repository<AuditLog>);
    create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog>;
    findAll(queryDto: QueryAuditLogDto): Promise<AuditLogListResponse>;
    findOne(id: number): Promise<AuditLog>;
    getStats(): Promise<any>;
    exportToCSV(queryDto: QueryAuditLogDto): Promise<string>;
    getInventoryFilterOptions(): Promise<{
        genres: string[];
        publishers: string[];
        authors: string[];
    }>;
    exportInventoryToCSV(queryDto: QueryAuditLogDto): Promise<string>;
    cleanupOldLogs(daysToKeep?: number): Promise<number>;
    deleteAllLogs(): Promise<number>;
    updateMetadataForExistingLogs(): Promise<number>;
}
