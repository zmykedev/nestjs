import { User } from '../entities/user.entity';

export function buildSession(
  userInfo: User,
  accessToken: string,
  refreshToken: string,
) {
  return {
    tokens: {
      accessToken,
      refreshToken,
      tokenType: 'JWT',
      expiresIn: 3600,
      issuedAt: Date.now(),
    },
    user: {
      id: userInfo.id,
      email: userInfo.email,

      firstName: userInfo.first_name,
      lastName: userInfo.last_name,
      createdAt: userInfo.created_at,
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
    meta: {
      location: 'Santiago, Chile',
      isActive: true,
    },
  };
}
