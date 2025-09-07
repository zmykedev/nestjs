import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto/create.user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Desencriptar la contraseña antes de crear el usuario
    const decryptedPassword = this.decryptPassword(createUserDto.password);

    // Crear usuario con contraseña desencriptada
    const userData = {
      ...createUserDto,
      password: decryptedPassword,
    };

    // La contraseña se hashea automáticamente en la entidad User con @BeforeInsert
    const createdUser = this.userRepository.create(userData);

    const saveUser = await this.userRepository.save(createdUser);

    // Remove sensitive data before returning
    delete saveUser.password;
    delete saveUser.refreshToken;

    return saveUser;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findByEmailAndGetPassword(email: string) {
    return await this.userRepository.findOne({
      select: ['id', 'password'],
      where: { email },
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findById(userId: number) {
    return await this.userRepository.findOneOrFail({ where: { id: userId } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneOrFail({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return this.userRepository.remove(user);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    //crypto is a node module, and bcrypt the maximum length of the hash is 60 characters, and token is longer than that, so we need to hash it
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const currentHashedRefreshToken = bcrypt.hashSync(hash, 10);
    return await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number) {
    await this.findById(userId);

    return this.userRepository.update(
      { id: userId },
      {
        refreshToken: undefined,
      },
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOne({
      select: ['id', 'refreshToken'],
      where: { id: userId },
    });

    if (!user || typeof user.refreshToken !== 'string') {
      throw new NotFoundException('User or refresh token not found');
    }

    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const isRefreshTokenMatching = await bcrypt.compare(
      hash,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return { id: user.id };
    }
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
}
