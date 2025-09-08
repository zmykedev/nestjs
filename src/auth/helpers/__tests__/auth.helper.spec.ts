import { buildSession } from '../auth.helper';
import { User } from '../../../users/models/user.model';

describe('AuthHelper', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    deletedAt: null,
    refreshToken: null,
  } as any;

  it('should build session correctly', () => {
    const accessToken = 'access-token-123';
    const refreshToken = 'refresh-token-456';

    const session = buildSession(mockUser, accessToken, refreshToken);

    expect(session).toBeDefined();
    expect(session.tokens).toBeDefined();
    expect(session.user).toBeDefined();
    expect(session.meta).toBeDefined();
  });

  it('should have correct token structure', () => {
    const accessToken = 'access-token-123';
    const refreshToken = 'refresh-token-456';

    const session = buildSession(mockUser, accessToken, refreshToken);

    expect(session.tokens.accessToken).toBe(accessToken);
    expect(session.tokens.refreshToken).toBe(refreshToken);
    expect(session.tokens.tokenType).toBe('JWT');
    expect(session.tokens.expiresIn).toBe(3600);
    expect(typeof session.tokens.issuedAt).toBe('number');
  });

  it('should have correct user structure', () => {
    const accessToken = 'access-token-123';
    const refreshToken = 'refresh-token-456';

    const session = buildSession(mockUser, accessToken, refreshToken);

    expect(session.user.id).toBe(mockUser.id);
    expect(session.user.email).toBe(mockUser.email);
    expect(session.user.firstName).toBe(mockUser.firstName);
    expect(session.user.lastName).toBe(mockUser.lastName);
    expect(session.user.createdAt).toBe(mockUser.createdAt);
    expect(typeof session.user.updatedAt).toBe('string');
    expect(typeof session.user.lastLoginAt).toBe('string');
  });

  it('should have correct meta structure', () => {
    const accessToken = 'access-token-123';
    const refreshToken = 'refresh-token-456';

    const session = buildSession(mockUser, accessToken, refreshToken);

    expect(session.meta.location).toBe('Santiago, Chile');
    expect(session.meta.isActive).toBe(true);
  });

  it('should generate current timestamps for updatedAt and lastLoginAt', () => {
    const accessToken = 'access-token-123';
    const refreshToken = 'refresh-token-456';
    const beforeTime = new Date().getTime();

    const session = buildSession(mockUser, accessToken, refreshToken);

    const afterTime = new Date().getTime();
    const updatedAtTime = new Date(session.user.updatedAt).getTime();
    const lastLoginAtTime = new Date(session.user.lastLoginAt).getTime();

    expect(updatedAtTime).toBeGreaterThanOrEqual(beforeTime);
    expect(updatedAtTime).toBeLessThanOrEqual(afterTime);
    expect(lastLoginAtTime).toBeGreaterThanOrEqual(beforeTime);
    expect(lastLoginAtTime).toBeLessThanOrEqual(afterTime);
  });
});
