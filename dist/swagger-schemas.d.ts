export declare class AuditLogSchema {
    id: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_id: string;
    user_email: string | null;
    user_name: string | null;
    action: string;
    entity_type: string | null;
    entity_id: string | null;
    description: string;
    request_data: any;
    response_data: any;
    status: string;
    level: string;
    ip_address: string;
    user_agent: string;
    endpoint: string;
    http_method: string;
    response_time_ms: number;
    error_message: string | null;
    metadata: any;
}
export declare class BookSchema {
    id: number;
    title: string;
    author: string;
    publisher: string;
    price: number;
    availability: boolean;
    genre: string;
    imageUrl?: string;
    description?: string;
    stock?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
export declare class UserSchema {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    last_login?: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
export declare class PaginationSchema {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class ApiResponseSchema<T> {
    status: boolean;
    data: T;
    message: string;
    timestamp: string;
    path: string;
    method: string;
    statusCode: number;
}
export declare class ErrorResponseSchema {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
}
