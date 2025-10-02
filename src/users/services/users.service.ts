import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
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

    // Crear usuario con contraseña hasheada
    const user = this.userRepository.create({
      first_name: createUserDto.firstName,
      last_name: createUserDto.lastName,
      email: createUserDto.email,
      password: await bcrypt.hash(decryptedPassword, 10),
      role_id: 2,
    });

    const savedUser = await this.userRepository.save(user);

    // Remove sensitive data before returning
    const { password, refresh_token, ...userWithoutSensitiveData } = savedUser;
    return userWithoutSensitiveData as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'role_id',
        'is_active',
        'last_login',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
    });
    return users;
  }

  async findByEmailAndGetPassword(
    email: string,
  ): Promise<{ id: number; password: string } | null> {
    const user = await this.userRepository.findOne({
      select: ['id', 'password'],
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      password: user.password,
    };
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'role_id',
        'is_active',
        'last_login',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
      where: { id },
    });
    return user;
  }

  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'role_id',
        'is_active',
        'last_login',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'role_id',
        'is_active',
        'last_login',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    // If password is being updated, decrypt and hash it
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(
        this.decryptPassword(updateData.password),
        10,
      );
    }

    await this.userRepository.update(id, updateData);

    // Get updated user without sensitive data
    const updatedUser = await this.userRepository.findOne({
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'role_id',
        'is_active',
        'last_login',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
      where: { id },
    });

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    await this.userRepository.softDelete(id);
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    // Ensure userId is a number
    const numericUserId = Number(userId);
    if (!numericUserId || isNaN(numericUserId)) {
      throw new NotFoundException(`Invalid user ID: ${userId}`);
    }

    // crypto is a node module, and bcrypt the maximum length of the hash is 60 characters,
    // and token is longer than that, so we need to hash it
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const currentHashedRefreshToken = await bcrypt.hash(hash, 10);

    const result = await this.userRepository.update(numericUserId, {
      refresh_token: currentHashedRefreshToken,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${numericUserId} not found`);
    }
  }

  async removeRefreshToken(userId: number): Promise<void> {
    const numericUserId = Number(userId);
    if (!numericUserId || isNaN(numericUserId)) {
      throw new NotFoundException(`Invalid user ID: ${userId}`);
    }

    await this.findById(numericUserId);

    await this.userRepository.update(numericUserId, { refresh_token: null });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<{ id: number } | undefined> {
    const numericUserId = Number(userId);
    if (!numericUserId || isNaN(numericUserId)) {
      throw new NotFoundException(`Invalid user ID: ${userId}`);
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
