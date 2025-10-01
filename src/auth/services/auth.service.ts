import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import config from '../../config';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDto } from '../../users/dto/create.user.dto';
import { PayloadToken } from './../models/token.model';
import { buildSession } from '../helpers/auth.helper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);

    const payload: PayloadToken = {
      id: newUser.id,
    };

    return this.login(payload);
  }

  async validateUser(email: string, password: string) {
    const user: {
      password: string;
      id: number;
    } = await this.usersService.findByEmailAndGetPassword(email);

    if (user) {
      // Desencriptar la contraseña antes de validar
      const decryptedPassword = this.decryptPassword(password);

      // Validar la contraseña desencriptada contra la base de datos
      const isMatch = await bcrypt.compare(decryptedPassword, user.password);

      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rta } = user;
        return rta;
      }
    }
    return null;
  }

  // Función para desencriptar la contraseña
  private decryptPassword(encryptedPassword: string): string {
    try {
      const key = 'cmpc2024'; // Misma clave que el frontend
      const decoded = atob(encryptedPassword); // Decodificar base64
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    } catch (error) {
      console.error('Error desencriptando contraseña:', error);
      return encryptedPassword; // Si falla, devolver la original
    }
  }

  async login(user: PayloadToken) {
    const { accessToken } = this.jwtToken(user);
    const refreshToken = this.jwtRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    // Obtener información completa del usuario
    const userInfo = await this.usersService.findOne(user.id);

    return {
      session: buildSession(userInfo, accessToken, refreshToken),
    };
  }

  jwtToken(user: PayloadToken) {
    const payload: PayloadToken = { id: user.id };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
    };
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
