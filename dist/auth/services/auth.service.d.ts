import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import config from '../../config';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDto } from '../../users/dto/create.user.dto';
import { PayloadToken } from './../models/token.model';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigType<typeof config>);
    register(createUserDto: CreateUserDto): Promise<{
        session: {
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
    }>;
    validateUser(email: string, password: string): Promise<{
        id: number;
    }>;
    private decryptPassword;
    login(user: PayloadToken): Promise<{
        session: {
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
    }>;
    jwtToken(user: PayloadToken): {
        accessToken: string;
    };
    jwtRefreshToken(user: PayloadToken): string;
    logout(user: PayloadToken): Promise<import("typeorm").UpdateResult>;
    createAccessTokenFromRefreshToken(user: PayloadToken): {
        accessToken: string;
    };
}
