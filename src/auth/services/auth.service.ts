import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import config from '../../config';
import { UsersService } from '../../users/services/users.service';
import { PayloadToken } from '../models/token.model';
import { buildSession } from '../helpers/auth.helper';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from '../dto/register.dto';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,

    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(req: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: req.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const decryptedPassword = this.decryptPassword(req.password);

    const user = this.userRepository.create({
      email: req.email,
      first_name: req.firstName,
      last_name: req.lastName,
      password: await bcrypt.hash(decryptedPassword, 10),
    });

    const savedUser = await this.userRepository.save(user);

    return this.login({
      id: savedUser.id,
    });
  }

  async validateUser(email: string, password: string) {
    const user: {
      password: string;
      id: number;
    } = await this.usersService.findByEmailAndGetPassword(email);

    if (!user) return null;

    const decryptedPassword = this.decryptPassword(password);
    const passwordDoesMatch = await bcrypt.compare(decryptedPassword, user.password);

    if (passwordDoesMatch) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }

  private decryptPassword(encryptedPassword: string): string {
    try {
      const key = process.env.FRONT_PASSWORD_ENCRYPT_KEY; // This key should match the one used in the frontend
      const decoded = atob(encryptedPassword);

      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }

      return decrypted;
    } catch (error) {
      console.error('Error decrypting password:', error);
      return encryptedPassword;
    }
  }

  async login(user: PayloadToken) {
    const jwtToken = this.jwtToken(user);
    const refreshToken = this.jwtRefreshToken(user);

    const numericUserId = Number(user.id);
    if (!numericUserId || isNaN(numericUserId)) {
      throw new NotFoundException(`Invalid user ID: ${user.id}`);
    }

    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const currentHashedRefreshToken = await bcrypt.hash(hash, 10);

    const result = await this.userRepository.update(numericUserId, {
      refresh_token: currentHashedRefreshToken,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${numericUserId} not found`);
    }

    const userInfo = await this.userRepository.findOne({
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'is_active',
        'last_login',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
      where: { id: user.id },
    });

    return {
      session: buildSession(userInfo, jwtToken, refreshToken),
    };
  }

  jwtToken(user: PayloadToken) {
    const payload: PayloadToken = { id: user.id };

    return this.jwtService.sign(payload);
  }

  jwtRefreshToken(user: PayloadToken) {
    const payload = { id: user.id };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.jwt.jwtRefreshSecret,
      expiresIn: this.configService.jwt.refreshTokenExpiration,
    });

    return refreshToken;
  }

  async logout(user: PayloadToken) {
    return await this.usersService.removeRefreshToken(user.id);
  }

  createAccessTokenFromRefreshToken(user: PayloadToken) {
    return this.jwtToken(user);
  }
}
