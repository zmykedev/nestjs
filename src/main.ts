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
  
  // Console logs para debug en Railway
  console.log('=== RAILWAY DEBUG INFO ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT from env:', process.env.PORT);
  console.log('PORT from config:', port);
  console.log('DATABASE_HOST:', process.env.DATABASE_HOST);
  console.log('DATABASE_PORT:', process.env.DATABASE_PORT);
  console.log('DATABASE_USER:', process.env.DATABASE_USER);
  console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('CORS: ENABLED for Netlify');
  console.log('========================');

  // Habilitar CORS para Netlify
  app.enableCors({
    origin: ['https://cmpc-books.netlify.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Bearer'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  setupSwagger(app);

  await app.listen(Number(port), '0.0.0.0');
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

void bootstrap();
