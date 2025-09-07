import { ConfigType } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import config from '../../config';
import { PayloadToken } from '../models/token.model';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigType<typeof config>);
    validate(payload: PayloadToken): PayloadToken;
}
export {};
