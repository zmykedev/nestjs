import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service.sequelize';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    usersService.create.mockResolvedValue(mockUser as any);

    const result = await controller.create({ email: 'test@test.com', password: 'password' } as any);
    expect(result).toBeDefined();
  });

  it('should find all users', async () => {
    const mockUsers = [{ id: 1, email: 'test@test.com' }];
    usersService.findAll.mockResolvedValue(mockUsers as any);

    const result = await controller.findAll();
    expect(result).toBeDefined();
  });

  it('should find one user', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    usersService.findOne.mockResolvedValue(mockUser as any);

    const result = await controller.findOne('1');
    expect(result).toBeDefined();
  });

  it('should update user', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    usersService.update.mockResolvedValue(mockUser as any);

    const result = await controller.update('1', { email: 'updated@test.com' } as any);
    expect(result).toBeDefined();
  });

  it('should remove user', async () => {
    usersService.remove.mockResolvedValue(undefined);

    const result = await controller.remove('1');
    expect(result).toBeUndefined();
    expect(usersService.remove).toHaveBeenCalledWith(1);
  });
});
