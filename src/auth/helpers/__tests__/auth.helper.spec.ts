import { buildSession } from '../auth.helper';
import { User } from '../../../users/entities/user.entity';

describe('AuthHelper', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    first_name: 'John',
    last_name: 'Doe',
    role_id: 1,
    is_active: true,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    deleted_at: null,
    refresh_token: null,
  } as User;

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
    expect(session.user.firstName).toBe(mockUser.first_name);
    expect(session.user.lastName).toBe(mockUser.last_name);
    expect(session.user.createdAt).toBe(mockUser.created_at);
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
