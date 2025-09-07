export declare abstract class BaseEntity {
    id: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    softDelete(): void;
    restore(): void;
    isDeleted(): boolean;
    isActive(): boolean;
}
export declare function CommonIndices(): (target: any) => void;
