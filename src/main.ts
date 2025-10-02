import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger.config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  // Create the NestJS application with increased payload limits
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true,
  });

  // Configure Express to handle larger payloads (50MB limit)
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  /**
   * @description
   * Set a global prefix for all API routes.
   * Example: /api/v1/...
   */
  app.setGlobalPrefix('api/v1');

  // Load environment configuration
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT');
  const env = configService.get<string>('NODE_ENV');
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  const production = env === 'production';

  /**
   * @description
   * List of allowed origins for CORS configuration.
   * This ensures only trusted domains can access the API.
   */
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:80',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:80',
  ];

  // In production, allow the frontend URL from environment variables
  if (production && frontendUrl) {
    allowedOrigins.push(frontendUrl);
  }

  /**
   * @description
   * Enable Cross-Origin Resource Sharing (CORS).
   * - Allow requests without "origin" (e.g., Postman, curl).
   * - In development, allow all origins.
   * - In production, allow only the defined list of origins.
   */
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (env === 'development') {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS not allowed'), false);
    },
    credentials: true,
  });

  /**
   * @description
   * Apply global validation pipes:
   * - Transform request payloads to DTOs.
   * - Remove unexpected fields.
   * - Throw errors if non-whitelisted fields are included.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * @description
   * Initialize Swagger API documentation.
   */
  setupSwagger(app);

  /**
   * @description
   * Start the server and listen on all network interfaces.
   */
  await app.listen(Number(port), '0.0.0.0');
}

void bootstrap();
