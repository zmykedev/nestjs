import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import config from '../../config';
import { UsersService } from '../../users/services/users.service';
import { PayloadToken } from '../models/token.model';
declare const JwtRefreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshTokenStrategy extends JwtRefreshTokenStrategy_base {
    private configService;
    private readonly userService;
    constructor(configService: ConfigType<typeof config>, userService: UsersService);
    validate(request: Request, payload: PayloadToken): Promise<{
        id: number;
    }>;
}
export {};
