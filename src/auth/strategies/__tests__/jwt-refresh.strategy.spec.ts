import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshTokenStrategy } from '../jwt-refresh.strategy';
import { UsersService } from '../../../users/services/users.service';
import config from '../../../config';

describe('JwtRefreshTokenStrategy', () => {
  let strategy: JwtRefreshTokenStrategy;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      getUserIfRefreshTokenMatches: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtRefreshTokenStrategy,
        {
          provide: config.KEY,
          useValue: {
            jwt: {
              jwtRefreshSecret: 'test-refresh-secret',
            },
          },
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    strategy = module.get<JwtRefreshTokenStrategy>(JwtRefreshTokenStrategy);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(strategy).toBeInstanceOf(JwtRefreshTokenStrategy);
  });

  it('should have validate method', () => {
    expect(typeof strategy.validate).toBe('function');
  });

  it('should call usersService.getUserIfRefreshTokenMatches in validate', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer test-refresh-token',
      },
    } as any;

    const mockPayload = {
      id: 1,
      email: 'test@example.com',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    usersService.getUserIfRefreshTokenMatches.mockResolvedValue(
      mockUser as any,
    );

    const result = await strategy.validate(mockRequest, mockPayload);

    expect(usersService.getUserIfRefreshTokenMatches).toHaveBeenCalledWith(
      'test-refresh-token',
      1,
    );
    expect(result).toBe(mockUser);
  });

  it('should extract refresh token from authorization header', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer extracted-token',
      },
    } as any;

    const mockPayload = {
      id: 2,
      email: 'test2@example.com',
    };

    usersService.getUserIfRefreshTokenMatches.mockResolvedValue(null);

    await strategy.validate(mockRequest, mockPayload);

    expect(usersService.getUserIfRefreshTokenMatches).toHaveBeenCalledWith(
      'extracted-token',
      2,
    );
  });
});
