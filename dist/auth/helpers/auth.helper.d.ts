import { User } from '../../users/entities/user.entity';
export declare function buildSession(userInfo: User, accessToken: string, refreshToken: string): {
    tokens: {
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresIn: number;
        issuedAt: number;
    };
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: string;
        lastLoginAt: string;
    };
    meta: {
        location: string;
        isActive: boolean;
    };
};
