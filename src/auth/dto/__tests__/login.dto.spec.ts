import { validate } from 'class-validator';
import {
  LoginDto,
  GetRefreshResponse,
  UserDto,
  TokensDto,
  SessionMetaDto,
  SessionDto,
  PostLoginResponse,
} from '../login.dto';

describe('LoginDto', () => {
  it('should create a valid LoginDto instance', () => {
    const loginDto = Object.assign(new LoginDto(), {
      email: 'test@example.com',
      password: 'password123',
    });

    expect(loginDto.email).toBe('test@example.com');
    expect(loginDto.password).toBe('password123');
  });

  it('should validate email format', async () => {
    const loginDto = Object.assign(new LoginDto(), {
      email: 'invalid-email',
      password: 'password123',
    });

    const errors = await validate(loginDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should validate required fields', async () => {
    const loginDto = new LoginDto();
    // Missing email and password

    const errors = await validate(loginDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should pass validation with valid data', async () => {
    const loginDto = Object.assign(new LoginDto(), {
      email: 'test@example.com',
      password: 'password123',
    });

    const errors = await validate(loginDto);
    expect(errors.length).toBe(0);
  });
});

describe('GetRefreshResponse', () => {
  it('should create a valid GetRefreshResponse instance', () => {
    const response = Object.assign(new GetRefreshResponse(), {
      accessToken: 'access-token-123',
    });

    expect(response.accessToken).toBe('access-token-123');
  });
});

describe('UserDto', () => {
  it('should create a valid UserDto instance', () => {
    const userDto = Object.assign(new UserDto(), {
      id: 1,
      email: 'test@example.com',
      role: 'user',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    });

    expect(userDto.id).toBe(1);
    expect(userDto.email).toBe('test@example.com');
    expect(userDto.role).toBe('user');
    expect(userDto.firstName).toBe('John');
    expect(userDto.lastName).toBe('Doe');
    expect(userDto.createdAt).toBeInstanceOf(Date);
    expect(userDto.updatedAt).toBeInstanceOf(Date);
    expect(userDto.lastLoginAt).toBeInstanceOf(Date);
  });

  it('should allow optional lastLoginAt', () => {
    const userDto = Object.assign(new UserDto(), {
      id: 1,
      email: 'test@example.com',
      role: 'user',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
      // lastLoginAt is optional
    });

    expect(userDto.lastLoginAt).toBeUndefined();
  });
});

describe('TokensDto', () => {
  it('should create a valid TokensDto instance', () => {
    const tokensDto = Object.assign(new TokensDto(), {
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
      expiresIn: 3600,
      issuedAt: Date.now(),
    });

    expect(tokensDto.accessToken).toBe('access-token-123');
    expect(tokensDto.refreshToken).toBe('refresh-token-456');
    expect(tokensDto.expiresIn).toBe(3600);
    expect(typeof tokensDto.issuedAt).toBe('number');
  });
});

describe('SessionMetaDto', () => {
  it('should create a valid SessionMetaDto instance', () => {
    const sessionMetaDto = Object.assign(new SessionMetaDto(), {
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      location: 'Santiago, Chile',
      isActive: true,
    });

    expect(sessionMetaDto.ipAddress).toBe('192.168.1.1');
    expect(sessionMetaDto.userAgent).toBe('Mozilla/5.0');
    expect(sessionMetaDto.location).toBe('Santiago, Chile');
    expect(sessionMetaDto.isActive).toBe(true);
  });

  it('should allow optional fields', () => {
    const sessionMetaDto = Object.assign(new SessionMetaDto(), {
      isActive: false,
      // Other fields are optional
    });

    expect(sessionMetaDto.ipAddress).toBeUndefined();
    expect(sessionMetaDto.userAgent).toBeUndefined();
    expect(sessionMetaDto.location).toBeUndefined();
    expect(sessionMetaDto.isActive).toBe(false);
  });
});

describe('SessionDto', () => {
  it('should create a valid SessionDto instance', () => {
    const tokensDto = Object.assign(new TokensDto(), {
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
      expiresIn: 3600,
      issuedAt: Date.now(),
    });

    const userDto = Object.assign(new UserDto(), {
      id: 1,
      email: 'test@example.com',
      role: 'user',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const sessionMetaDto = Object.assign(new SessionMetaDto(), {
      isActive: true,
    });

    const sessionDto = Object.assign(new SessionDto(), {
      tokens: tokensDto,
      user: userDto,
      meta: sessionMetaDto,
    });

    expect(sessionDto.tokens).toBe(tokensDto);
    expect(sessionDto.user).toBe(userDto);
    expect(sessionDto.meta).toBe(sessionMetaDto);
  });
});

describe('PostLoginResponse', () => {
  it('should create a valid PostLoginResponse instance', () => {
    const tokensDto = Object.assign(new TokensDto(), {
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
      expiresIn: 3600,
      issuedAt: Date.now(),
    });

    const userDto = Object.assign(new UserDto(), {
      id: 1,
      email: 'test@example.com',
      role: 'user',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const sessionMetaDto = Object.assign(new SessionMetaDto(), {
      isActive: true,
    });

    const sessionDto = Object.assign(new SessionDto(), {
      tokens: tokensDto,
      user: userDto,
      meta: sessionMetaDto,
    });

    const postLoginResponse = Object.assign(new PostLoginResponse(), {
      session: sessionDto,
    });

    expect(postLoginResponse.session).toBe(sessionDto);
  });
});