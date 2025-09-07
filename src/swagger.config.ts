import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('CMPC-Libros API')
    .setDescription(
      `
# 📚 CMPC-Libros API - Sistema de Gestión de Inventario

## 🎯 Descripción General
API RESTful empresarial para gestión completa de inventario de libros con arquitectura escalable, autenticación JWT, exportación de datos y sistema de auditoría completo.

## 🔐 Autenticación
Esta API utiliza **JWT (JSON Web Tokens)** para autenticación. Para acceder a endpoints protegidos:

1. **Registrarse**: POST /api/v1/auth/register
2. **Iniciar sesión**: POST /api/v1/auth/login
3. **Usar el token**: Incluir en el header: Authorization: Bearer <token>

## 🏗️ Arquitectura
- **Base URL**: /api/v1
- **Formato de respuesta**: JSON consistente con estructura { status, data, message }
- **Soft Delete**: Todas las entidades implementan eliminación lógica para auditoría
- **Paginación**: Endpoints de listado soportan paginación con page y limit

## 📊 Sistema de Auditoría
Todos los endpoints están auditados automáticamente, registrando:
- Usuario que realiza la acción
- Timestamp de la operación
- Datos de request/response
- IP y User-Agent
- Tiempo de respuesta
- Estado de la operación

## 🔒 Roles y Permisos
- **ADMIN**: Acceso completo al sistema
- **LIBRARIAN**: Gestión de libros y auditoría
- **USER**: Consulta de libros y operaciones básicas

## 🚀 Características Destacadas
- ✅ **CRUD completo** para todas las entidades
- ✅ **Búsqueda avanzada** con filtros múltiples
- ✅ **Exportación CSV** con filtros personalizables
- ✅ **Soft Delete** para auditoría completa
- ✅ **Paginación optimizada** para grandes volúmenes
- ✅ **Validación robusta** de datos de entrada
- ✅ **Manejo de errores** centralizado
- ✅ **Logging automático** de todas las operaciones

## 📖 Ejemplos de Uso
### Crear un libro
\`\`\`bash
curl -X POST "http://localhost:3001/api/v1/books" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "El Quijote",
    "author": "Miguel de Cervantes",
    "publisher": "Editorial Planeta",
    "price": 25.99,
    "genre": "Ficción",
    "availability": true
  }'
\`\`\`

### Buscar libros
\`\`\`bash
curl -X POST "http://localhost:3001/api/v1/books/search" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": {
      "search": "ciencia ficción",
      "genre": "Ficción",
      "availability": true,
      "page": 1,
      "limit": 20
    }
  }'
\`\`\`

## 📚 Recursos Disponibles
- **📖 Libros**: Gestión completa del inventario
- **👥 Usuarios**: Administración de usuarios del sistema
- **🔐 Autenticación**: Login, registro y gestión de tokens
- **📊 Auditoría**: Logs detallados de todas las operaciones

## 🆘 Soporte
Para soporte técnico o reportar problemas, contactar al equipo de desarrollo.
    `,
    )
    .setVersion('1.0.0')
    .setContact(
      'CMPC API Team',
      'https://github.com/cmpc-api',
      'dev@cmpc-api.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3001', 'Servidor de Desarrollo')
    .addServer('https://api.cmpc-books.com', 'Servidor de Producción')
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
    .addTag('books', '📚 Gestión de Libros')
    .addTag('users', '👥 Gestión de Usuarios')
    .addTag('audit-logs', '📊 Sistema de Auditoría')
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
    customSiteTitle: 'CMPC-Libros API Documentation',
    customfavIcon: '/favicon.ico',
  });

  return document;
}
