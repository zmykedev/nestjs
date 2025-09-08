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
4. **Renovar token**: GET /api/v1/auth/refresh (con refresh token)

## 🏗️ Arquitectura
- **Base URL**: /api/v1
- **Formato de respuesta**: JSON consistente con estructura { status, data, message }
- **Soft Delete**: Todas las entidades implementan eliminación lógica para auditoría
- **Paginación**: Endpoints de listado soportan paginación con page y limit
- **Filtros avanzados**: Búsqueda por múltiples criterios con ordenamiento

## 📊 Sistema de Auditoría
Todos los endpoints están auditados automáticamente, registrando:
- Usuario que realiza la acción
- Timestamp de la operación
- Datos de request/response
- IP y User-Agent
- Tiempo de respuesta
- Estado de la operación
- Metadatos específicos por entidad

## 🔒 Roles y Permisos
- **ADMIN**: Acceso completo al sistema, gestión de usuarios y auditoría
- **LIBRARIAN**: Gestión de libros, exportación y consulta de auditoría
- **USER**: Consulta de libros y operaciones básicas

## 🚀 Características Destacadas
- ✅ **CRUD completo** para todas las entidades
- ✅ **Búsqueda avanzada** con filtros múltiples y ordenamiento
- ✅ **Exportación CSV** con filtros personalizables
- ✅ **Soft Delete** para auditoría completa
- ✅ **Paginación optimizada** para grandes volúmenes
- ✅ **Validación robusta** de datos de entrada
- ✅ **Manejo de errores** centralizado
- ✅ **Logging automático** de todas las operaciones
- ✅ **Subida de archivos** con validación de tipos y tamaños
- ✅ **Estadísticas de auditoría** en tiempo real
- ✅ **Filtros de inventario** especializados

## 📖 Ejemplos de Uso

### 1. Autenticación
\`\`\`bash
# Registro de usuario
curl -X POST "http://localhost:3001/api/v1/auth/register" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "usuario@cmpc.com",
    "password": "password123",
    "first_name": "Juan",
    "last_name": "Pérez"
  }'

# Login
curl -X POST "http://localhost:3001/api/v1/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "usuario@cmpc.com",
    "password": "password123"
  }'
\`\`\`

### 2. Gestión de Libros
\`\`\`bash
# Crear un libro
curl -X POST "http://localhost:3001/api/v1/books" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "El Quijote",
    "author": "Miguel de Cervantes",
    "publisher": "Editorial Planeta",
    "price": 25.99,
    "genre": "Ficción",
    "availability": true,
    "stock": 15,
    "description": "Obra maestra de la literatura universal"
  }'

# Búsqueda avanzada
curl -X POST "http://localhost:3001/api/v1/books/search" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": {
      "search": "ciencia ficción",
      "genre": "Ficción",
      "availability": true,
      "minPrice": 10,
      "maxPrice": 50,
      "page": 1,
      "limit": 20,
      "sortBy": "title",
      "sortOrder": "ASC"
    }
  }'

# Exportar a CSV
curl -X GET "http://localhost:3001/api/v1/books/export/csv" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  --output books.csv
\`\`\`

### 3. Subida de Archivos
\`\`\`bash
# Subir imagen de libro
curl -X POST "http://localhost:3001/api/v1/books/upload-image-only" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -F "file=@/path/to/image.jpg"
\`\`\`

### 4. Auditoría
\`\`\`bash
# Obtener logs de auditoría
curl -X GET "http://localhost:3001/api/v1/audit-logs?page=1&limit=20&action=READ" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Estadísticas de auditoría
curl -X GET "http://localhost:3001/api/v1/audit-logs/stats" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Exportar logs de inventario
curl -X GET "http://localhost:3001/api/v1/audit-logs/inventory/export" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  --output inventory-logs.csv
\`\`\`

## 📚 Recursos Disponibles

### 🔐 Autenticación (/api/v1/auth)
- **POST /register**: Registro de nuevos usuarios
- **POST /login**: Inicio de sesión con JWT
- **GET /logout**: Cerrar sesión
- **GET /refresh**: Renovar token de acceso

### 📖 Libros (/api/v1/books)
- **POST /**: Crear nuevo libro
- **GET /**: Listar todos los libros
- **POST /search**: Búsqueda avanzada con filtros
- **GET /:id**: Obtener libro por ID
- **PATCH /:id**: Actualización parcial
- **PUT /:id**: Actualización completa
- **DELETE /:id**: Eliminación lógica
- **POST /upload-image-only**: Subir imagen de libro
- **GET /export/csv**: Exportar a CSV
- **GET /genres**: Obtener géneros disponibles
- **GET /authors**: Obtener autores disponibles
- **GET /publishers**: Obtener editoriales disponibles

### 👥 Usuarios (/api/v1/users)
- **POST /**: Crear nuevo usuario
- **GET /**: Listar todos los usuarios
- **GET /:id**: Obtener usuario por ID
- **PATCH /:id**: Actualizar usuario
- **DELETE /:id**: Eliminación lógica

### 📊 Auditoría (/api/v1/audit-logs)
- **GET /**: Listar logs con filtros
- **GET /stats**: Estadísticas de auditoría
- **GET /actions**: Acciones disponibles
- **GET /export**: Exportar logs a CSV
- **GET /inventory**: Logs específicos de inventario
- **GET /inventory/export**: Exportar logs de inventario
- **GET /inventory/filter-options**: Opciones de filtro
- **DELETE /delete-all**: Eliminar todos los logs
- **GET /cleanup**: Limpiar logs antiguos

### 💾 Storage (/api/v1/storage)
- **POST /upload-simple**: Subida simple de archivos

## 🔧 Configuración y Despliegue
- **Puerto**: 3001 (desarrollo)
- **Base de datos**: PostgreSQL con Sequelize ORM
- **Storage**: Google Cloud Storage / ImgBB
- **Autenticación**: JWT con refresh tokens
- **Validación**: Class-validator con DTOs
- **Documentación**: Swagger/OpenAPI 3.0

## 🆘 Soporte
Para soporte técnico o reportar problemas, contactar al equipo de desarrollo.

**Versión**: 1.0.0  
**Última actualización**: ${new Date().toISOString().split('T')[0]}
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
    .addTag('Storage', '💾 Gestión de Archivos')
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
