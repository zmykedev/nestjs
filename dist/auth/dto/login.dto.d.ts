export declare class LoginDto {
    readonly email: string;
    readonly password: string;
}
export declare class GetRefreshResponse {
    readonly accessToken: string;
}
export declare class UserDto {
    readonly id: number;
    readonly email: string;
    readonly role: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly lastLoginAt?: Date;
}
export declare class TokensDto {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly expiresIn: number;
    readonly issuedAt: number;
}
export declare class SessionMetaDto {
    readonly ipAddress?: string;
    readonly userAgent?: string;
    readonly location?: string;
    readonly isActive: boolean;
}
export declare class SessionDto {
    readonly tokens: TokensDto;
    readonly user: UserDto;
    readonly meta: SessionMetaDto;
}
export declare class PostLoginResponse {
    readonly session: SessionDto;
}
