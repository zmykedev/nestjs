import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    port: Number(process.env.PORT ?? '3000'),
    db: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT ?? '5432'),
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
      jwtSecret: process.env.JWT_SECRET ?? 'defaultSecret123',
      jwtRefreshSecret:
        process.env.JWT_REFRESH_SECRET ?? 'defaultRefreshSecret123',
      refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION ?? '7d',
      accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION ?? '1h',
    },
    gcs: {
      projectId: process.env.GCS_PROJECT_ID,
      bucketName: process.env.GCS_BUCKET_NAME,
      keyFile: process.env.GCS_KEY_FILE,
    },
  };
});
