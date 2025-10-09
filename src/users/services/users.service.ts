import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>) {
    const user = await this.userRepository.preload({ id, ...updateData });
    return this.userRepository.save(user);
  }

  getInfoById(id: number) {
    return this.userRepository.findOne({
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
      where: { id },
    });
  }
}
