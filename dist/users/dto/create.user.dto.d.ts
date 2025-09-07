export declare class CreateUserDto {
    readonly email?: string;
    readonly password: string;
    readonly firstName: string;
    readonly lastName: string;
}
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export declare class DefaultColumnsResponse extends CreateUserDto {
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export {};
