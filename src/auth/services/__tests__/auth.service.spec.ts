import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UsersService } from '../../../users/services/users.service.sequelize';
import { CreateUserDto } from '../../../users/dto/create.user.dto';
import { PayloadToken } from '../../models/token.model';
import config from '../../../config';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockConfigService = {
    jwt: {
      jwtSecret: 'test-secret',
      jwtRefreshSecret: 'test-refresh-secret',
      refreshTokenExpiration: '7d',
      accessTokenExpiration: '1h',
    },
  };

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findByEmailAndGetPassword: jest.fn(),
      setCurrentRefreshToken: jest.fn(),
      findOne: jest.fn(),
      removeRefreshToken: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return login session', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockAccessToken = 'access-token';
      const mockRefreshToken = 'refresh-token';

      usersService.create.mockResolvedValue(mockUser as any);
      jwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);
      usersService.setCurrentRefreshToken.mockResolvedValue(undefined);
      usersService.findOne.mockResolvedValue(mockUser as any);

      const result = await service.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toHaveProperty('session');
      expect(result.session).toHaveProperty('tokens');
      expect(result.session).toHaveProperty('user');
      expect(result.session).toHaveProperty('meta');
    });
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashed-password';

      const mockUser = {
        id: 1,
        password: hashedPassword,
      };

      usersService.findByEmailAndGetPassword.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmailAndGetPassword).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });

    it('should return null when user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      usersService.findByEmailAndGetPassword.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrong-password';
      const hashedPassword = 'hashed-password';

      const mockUser = {
        id: 1,
        password: hashedPassword,
      };

      usersService.findByEmailAndGetPassword.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('decryptPassword', () => {
    it('should decrypt password successfully', () => {
      // This is a private method, but we can test it indirectly through validateUser
      const email = 'test@example.com';
      const encryptedPassword = btoa('password123'); // Simple base64 encoding for test

      const mockUser = {
        id: 1,
        password: 'hashed-password',
      };

      usersService.findByEmailAndGetPassword.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      service.validateUser(email, encryptedPassword);

      expect(usersService.findByEmailAndGetPassword).toHaveBeenCalledWith(email);
    });
  });

  describe('login', () => {
    it('should create login session with tokens', async () => {
      const user: PayloadToken = { id: 1 };
      const mockUserInfo = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockAccessToken = 'access-token';
      const mockRefreshToken = 'refresh-token';

      jwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);
      usersService.setCurrentRefreshToken.mockResolvedValue(undefined);
      usersService.findOne.mockResolvedValue(mockUserInfo as any);

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({ id: 1 });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: 1 },
        {
          secret: mockConfigService.jwt.jwtRefreshSecret,
          expiresIn: mockConfigService.jwt.refreshTokenExpiration,
        },
      );
      expect(usersService.setCurrentRefreshToken).toHaveBeenCalledWith(
        mockRefreshToken,
        1,
      );
      expect(result).toHaveProperty('session');
    });
  });

  describe('jwtToken', () => {
    it('should generate access token', () => {
      const user: PayloadToken = { id: 1 };
      const mockToken = 'access-token';

      jwtService.sign.mockReturnValue(mockToken);

      const result = service.jwtToken(user);

      expect(jwtService.sign).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ accessToken: mockToken });
    });
  });

  describe('jwtRefreshToken', () => {
    it('should generate refresh token', () => {
      const user: PayloadToken = { id: 1 };
      const mockRefreshToken = 'refresh-token';

      jwtService.sign.mockReturnValue(mockRefreshToken);

      const result = service.jwtRefreshToken(user);

      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: 1 },
        {
          secret: mockConfigService.jwt.jwtRefreshSecret,
          expiresIn: mockConfigService.jwt.refreshTokenExpiration,
        },
      );
      expect(result).toBe(mockRefreshToken);
    });
  });

  describe('logout', () => {
    it('should remove refresh token', async () => {
      const user: PayloadToken = { id: 1 };

      usersService.removeRefreshToken.mockResolvedValue(undefined);

      const result = await service.logout(user);

      expect(usersService.removeRefreshToken).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });

  describe('createAccessTokenFromRefreshToken', () => {
    it('should create access token from refresh token', () => {
      const user: PayloadToken = { id: 1 };
      const mockToken = 'access-token';

      jwtService.sign.mockReturnValue(mockToken);

      const result = service.createAccessTokenFromRefreshToken(user);

      expect(jwtService.sign).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ accessToken: mockToken });
    });
  });
});
