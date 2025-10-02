import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Template API')
    .setDescription(
      `
# 🚀 NestJS Template API

## 🎯 Descripción General
Template base para aplicaciones NestJS con autenticación JWT, gestión de usuarios y arquitectura escalable.

## 🔐 Autenticación
Esta API utiliza **JWT (JSON Web Tokens)** para autenticación. Para acceder a endpoints protegidos:

1. **Registrarse**: POST /api/v1/auth/register
2. **Iniciar sesión**: POST /api/v1/auth/login
3. **Usar el token**: Incluir en el header: Authorization: Bearer <token>
4. **Renovar token**: GET /api/v1/auth/refresh (con refresh token)

## 🏗️ Arquitectura
- **Base URL**: /api/v1
- **Formato de respuesta**: JSON consistente
- **Validación**: Class-validator con DTOs
- **Base de datos**: PostgreSQL con TypeORM

## 📖 Ejemplos de Uso

### 1. Autenticación
\`\`\`bash
# Registro de usuario
curl -X POST "http://localhost:3001/api/v1/auth/register" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "first_name": "Juan",
    "last_name": "Pérez"
  }'

# Login
curl -X POST "http://localhost:3001/api/v1/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
\`\`\`

## 📚 Recursos Disponibles

### 🔐 Autenticación (/api/v1/auth)
- **POST /register**: Registro de nuevos usuarios
- **POST /login**: Inicio de sesión con JWT
- **GET /logout**: Cerrar sesión
- **GET /refresh**: Renovar token de acceso

### 👥 Usuarios (/api/v1/users)
- **POST /**: Crear nuevo usuario
- **GET /**: Listar todos los usuarios
- **GET /:id**: Obtener usuario por ID
- **PATCH /:id**: Actualizar usuario
- **DELETE /:id**: Eliminar usuario

## 🔧 Configuración
- **Puerto**: 3001 (desarrollo)
- **Base de datos**: PostgreSQL con TypeORM
- **Autenticación**: JWT con refresh tokens
- **Documentación**: Swagger/OpenAPI 3.0

**Versión**: 1.0.0  
**Última actualización**: ${new Date().toISOString().split('T')[0]}
    `,
    )
    .setVersion('1.0.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3001', 'Servidor de Desarrollo')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Access Token obtenido del endpoint de login',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Refresh Token para renovar el access token',
      },
      'refresh-token',
    )
    .addTag('auth', '🔐 Autenticación y Autorización')
    .addTag('users', '👥 Gestión de Usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Configurar opciones adicionales de Swagger
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      tryItOutEnabled: true,
      requestInterceptor: (req: { headers: Record<string, string> }) => {
        // Agregar headers por defecto para testing
        req.headers['Content-Type'] = 'application/json';
        return req;
      },
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3f51b5; font-size: 36px; }
      .swagger-ui .info .description { font-size: 14px; line-height: 1.5; }
      .swagger-ui .scheme-container { background: #f5f5f5; padding: 10px; border-radius: 5px; }
      .swagger-ui .authorization__btn { background: #4caf50; color: white; }
      .swagger-ui .btn.execute { background: #2196f3; color: white; }
    `,
    customSiteTitle: 'NestJS Template API Documentation',
    customfavIcon: '/favicon.ico',
  });

  return document;
}
