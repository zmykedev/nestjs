import { BaseEntity } from './base.entity';
export declare enum AuditLogAction {
    INVENTORY_ADDED = "INVENTORY_ADDED",
    INVENTORY_UPDATED = "INVENTORY_UPDATED",
    INVENTORY_REMOVED = "INVENTORY_REMOVED",
    INVENTORY_VIEWED = "INVENTORY_VIEWED",
    INVENTORY_SEARCHED = "INVENTORY_SEARCHED",
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    EXPORT = "EXPORT",
    IMPORT = "IMPORT",
    SEARCH = "SEARCH",
    FILTER = "FILTER",
    SORT = "SORT",
    PAGINATION = "PAGINATION"
}
export declare enum AuditLogStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    PENDING = "PENDING"
}
export declare enum AuditLogLevel {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    DEBUG = "DEBUG"
}
export declare class AuditLog extends BaseEntity {
    user_id: string;
    user_email: string;
    user_name: string;
    action: AuditLogAction;
    entity_type: string;
    entity_id: string;
    description: string;
    request_data: any;
    response_data: any;
    status: AuditLogStatus;
    level: AuditLogLevel;
    ip_address: string;
    user_agent: string;
    endpoint: string;
    http_method: string;
    response_time_ms: number;
    error_message: string;
    metadata: any;
}
