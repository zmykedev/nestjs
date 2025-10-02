import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    port: Number(process.env.PORT),
    db: {
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      name: process.env.DATABASE_NAME,
    },
    devtools: {
      enabled: process.env.NODE_ENV !== 'production',
      port: 8000,
    },
    env: process.env.NODE_ENV,
    cors: process.env.CORS,
    jwt: {
      jwtSecret: process.env.JWT_SECRET || 'cmpc2024',
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
      accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
    },
    frontendUrl: process.env.FRONTEND_URL,
  };
});
