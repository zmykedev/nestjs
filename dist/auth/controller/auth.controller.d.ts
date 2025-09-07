/// <reference types="express-serve-static-core" />
/// <reference types="passport" />
/// <reference types="multer" />
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../../users/dto/create.user.dto';
import { PayloadToken } from '../models/token.model';
import { AuthService } from '../services/auth.service';
type AuthorizedRequest = Express.Request & {
    headers: {
        authorization: string;
    };
    user: PayloadToken;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(loginDto: LoginDto): Promise<{
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
    logOut(req: {
        user: PayloadToken;
    }): Promise<void>;
    refresh(req: AuthorizedRequest): {
        accessToken: string;
    };
}
export {};
