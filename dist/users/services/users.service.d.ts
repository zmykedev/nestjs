import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto/create.user.dto';
import { User } from '../entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findByEmailAndGetPassword(email: string): Promise<User>;
    findOne(id: number): Promise<User>;
    findById(userId: number): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<User>;
    setCurrentRefreshToken(refreshToken: string, userId: number): Promise<import("typeorm").UpdateResult>;
    removeRefreshToken(userId: number): Promise<import("typeorm").UpdateResult>;
    getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<{
        id: number;
    }>;
    private decryptPassword;
}
