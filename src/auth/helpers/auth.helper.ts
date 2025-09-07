import { User } from '../../users/entities/user.entity';

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

      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      createdAt: userInfo.createdAt,
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
    meta: {
      location: 'Santiago, Chile',
      isActive: true,
    },
  };
}
