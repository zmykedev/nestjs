import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  app.setGlobalPrefix('api/v1');

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);

  const port = process.env.PORT || configService.get<number>('PORT') || 3000;

  // Reemplaza tu lógica CORS actual con esto:
  const nodeEnv = process.env.NODE_ENV;

  const isDev = nodeEnv === 'dev' || nodeEnv !== 'production';

  if (isDev) {
    // Desarrollo: orígenes específicos con credentials
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://localhost:80', // Para Docker local
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:80',
        
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Bearer',
      ],
      credentials: true,
    });
  } else {
    // Producción: configuración flexible para múltiples dominios
    const allowedOrigins = [
      'https://cmpc-books.netlify.app',
      'https://cmpc-frontend.netlify.app', // Si tienes otro dominio
      'http://localhost:80', // Para testing local
      'http://localhost:3000', // Para testing local
      'http://localhost:5173', // Para Vite dev server
      'http://127.0.0.1:5173', // Para Vite dev server
    ];

    // Agregar dominio desde variable de entorno si existe
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }

    app.enableCors({
      origin: (origin, callback) => {
        // Permitir requests sin origin (mobile apps, postman, etc.)
        if (!origin) return callback(null, true);

        return callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Bearer',
      ],
      credentials: true,
    });
   
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  setupSwagger(app);

  await app.listen(Number(port), '0.0.0.0');

}

void bootstrap();
