import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import config from '../../config';
import { PayloadToken } from '../models/token.model';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../services/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: configService.jwt.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: PayloadToken) {
    const refreshToken = request.headers.authorization.split(' ')[1];

    const numericUserId = Number(payload.id);
    if (!numericUserId || isNaN(numericUserId)) {
      throw new NotFoundException(`Invalid user ID: ${payload.id}`);
    }

    const user = await this.userRepository.findOne({
      select: ['id', 'refresh_token'],
      where: { id: numericUserId },
    });

    if (!user || !user.refresh_token) {
      throw new NotFoundException('User or refresh token not found');
    }

    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const isRefreshTokenMatching = await bcrypt.compare(
      hash,
      user.refresh_token,
    );

    if (isRefreshTokenMatching) {
      return { id: user.id };
    }

    return undefined;
  }
}
