import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
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
export declare class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>>;
}
export declare class ErrorResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
export declare class ApiResponseHelper {
    static success<T>(data: T, message?: string, statusCode?: number): ApiResponse<T>;
    static error(message: string, statusCode?: number, errors?: any[]): ApiResponse<null>;
    static paginated<T>(items: T[], page: number, limit: number, total: number, message?: string): ApiResponse<T[]>;
}
