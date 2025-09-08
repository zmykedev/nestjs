import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { CreateUserDto, UpdateUserDto } from '../dto/create.user.dto';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
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

    // La contraseña se hashea automáticamente en el modelo User con @BeforeCreate
    const createdUser = await this.userModel.create(userData);

    // Remove sensitive data before returning
    const userJson = createdUser.toJSON();
    delete userJson.password;
    delete userJson.refreshToken;

    return userJson as User;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: { exclude: ['password', 'refreshToken'] },
    });
  }

  async findByEmailAndGetPassword(
    email: string,
  ): Promise<{ id: number; password: string } | null> {
    const user = await this.userModel.findOne({
      attributes: ['id', 'password'],
      where: { email },
    });

    if (!user) {
      return null;
    }

    // Return plain object instead of Sequelize model
    return {
      id: user.id,
      password: user.password,
    };
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userModel.findByPk(id, {
      attributes: { exclude: ['password', 'refreshToken'] },
    });
  }

  async findById(userId: number): Promise<User> {
    const user = await this.userModel.findByPk(userId, {
      attributes: { exclude: ['password', 'refreshToken'] },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: { exclude: ['password', 'refreshToken'] },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    // If password is being updated, decrypt it first
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = this.decryptPassword(updateData.password);
    }

    await user.update(updateData);

    // Remove sensitive data before returning
    const userJson = user.toJSON();
    delete userJson.password;
    delete userJson.refreshToken;

    return userJson as User;
  }

  async remove(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    await user.destroy(); // Soft delete with paranoid: true
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
    const currentHashedRefreshToken = bcrypt.hashSync(hash, 10);

    const [affectedRows] = await this.userModel.update(
      { refreshToken: currentHashedRefreshToken },
      { where: { id: numericUserId } },
    );

    if (affectedRows === 0) {
      throw new NotFoundException(`User with id ${numericUserId} not found`);
    }
  }

  async removeRefreshToken(userId: number): Promise<void> {
    const numericUserId = Number(userId);
    if (!numericUserId || isNaN(numericUserId)) {
      throw new NotFoundException(`Invalid user ID: ${userId}`);
    }

    await this.findById(numericUserId);

    await this.userModel.update(
      { refreshToken: null },
      { where: { id: numericUserId } },
    );
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<{ id: number } | undefined> {
    const numericUserId = Number(userId);
    if (!numericUserId || isNaN(numericUserId)) {
      throw new NotFoundException(`Invalid user ID: ${userId}`);
    }

    const user = await this.userModel.findByPk(numericUserId, {
      attributes: ['id', 'refreshToken'],
    });

    if (!user || !user.refreshToken) {
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
