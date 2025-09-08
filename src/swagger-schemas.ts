import { ApiProperty } from '@nestjs/swagger';

// Esquemas personalizados para Swagger

export class AuditLogSchema {
  @ApiProperty({
    description: 'ID único del log de auditoría',
    example: 104,
  })
  id: number;

  @ApiProperty({
    description: 'Estado activo del registro',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Fecha de creación del log',
    example: '2025-09-04T22:24:18.373Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-09-04T22:24:18.373Z',
  })
  updated_at: string;

  @ApiProperty({
    description: 'Fecha de eliminación (soft delete)',
    example: null,
    nullable: true,
  })
  deleted_at: string | null;

  @ApiProperty({
    description: 'ID del usuario que realizó la acción',
    example: '12',
  })
  user_id: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'admin@cmpc.com',
    nullable: true,
  })
  user_email: string | null;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Administrador',
    nullable: true,
  })
  user_name: string | null;

  @ApiProperty({
    description: 'Acción realizada',
    example: 'READ',
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT'],
  })
  action: string;

  @ApiProperty({
    description: 'Tipo de entidad afectada',
    example: 'Book',
    nullable: true,
  })
  entity_type: string | null;

  @ApiProperty({
    description: 'ID de la entidad afectada',
    example: '45',
    nullable: true,
  })
  entity_id: string | null;

  @ApiProperty({
    description: 'Descripción de la acción realizada',
    example: 'Consultar lista de libros',
  })
  description: string;

  @ApiProperty({
    description: 'Datos de la petición HTTP',
    example: {
      url: '/api/v1/books',
      method: 'GET',
      headers: { authorization: '[REDACTED]' },
    },
  })
  request_data: any;

  @ApiProperty({
    description: 'Datos de la respuesta HTTP',
    example: {
      status: 'success',
      message: 'Books retrieved successfully',
    },
  })
  response_data: any;

  @ApiProperty({
    description: 'Estado de la operación',
    example: 'SUCCESS',
    enum: ['SUCCESS', 'FAILURE', 'PENDING'],
  })
  status: string;

  @ApiProperty({
    description: 'Nivel del log',
    example: 'INFO',
    enum: ['INFO', 'WARNING', 'ERROR', 'DEBUG'],
  })
  level: string;

  @ApiProperty({
    description: 'Dirección IP del usuario',
    example: '::1',
  })
  ip_address: string;

  @ApiProperty({
    description: 'User-Agent del navegador',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
  })
  user_agent: string;

  @ApiProperty({
    description: 'Endpoint de la API llamado',
    example: '/api/v1/books',
  })
  endpoint: string;

  @ApiProperty({
    description: 'Método HTTP utilizado',
    example: 'GET',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
  http_method: string;

  @ApiProperty({
    description: 'Tiempo de respuesta en milisegundos',
    example: 27,
  })
  response_time_ms: number;

  @ApiProperty({
    description: 'Mensaje de error si la operación falló',
    example: null,
    nullable: true,
  })
  error_message: string | null;

  @ApiProperty({
    description: 'Metadatos adicionales de la operación',
    example: { sessionId: 'abc123', correlationId: 'def456' },
    nullable: true,
  })
  metadata: any;
}

export class BookSchema {
  @ApiProperty({
    description: 'ID único del libro',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Título del libro',
    example: 'El Quijote',
    minLength: 2,
    maxLength: 255,
  })
  title: string;

  @ApiProperty({
    description: 'Autor del libro',
    example: 'Miguel de Cervantes',
    minLength: 2,
    maxLength: 255,
  })
  author: string;

  @ApiProperty({
    description: 'Editorial del libro',
    example: 'Editorial Planeta',
    minLength: 2,
    maxLength: 255,
  })
  publisher: string;

  @ApiProperty({
    description: 'Precio del libro',
    example: 25.99,
    minimum: 0,
    maximum: 1000000,
  })
  price: number;

  @ApiProperty({
    description: 'Disponibilidad del libro',
    example: true,
  })
  availability: boolean;

  @ApiProperty({
    description: 'Género literario',
    example: 'Ficción',
    minLength: 2,
    maxLength: 100,
  })
  genre: string;

  @ApiProperty({
    description: 'URL de la imagen del libro',
    example: 'https://example.com/quijote.jpg',
    nullable: true,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Descripción del libro',
    example: 'Obra maestra de la literatura universal',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Stock disponible',
    example: 15,
    minimum: 0,
    default: 0,
  })
  stock?: number;

  @ApiProperty({
    description: 'Estado activo del registro',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updated_at: string;

  @ApiProperty({
    description: 'Fecha de eliminación (soft delete)',
    example: null,
    nullable: true,
  })
  deleted_at: string | null;
}

export class UserSchema {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email del usuario (debe ser único)',
    example: 'admin@cmpc.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    minLength: 2,
    maxLength: 100,
  })
  first_name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    minLength: 2,
    maxLength: 100,
  })
  last_name: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    example: 'ADMIN',
    enum: ['ADMIN', 'LIBRARIAN', 'USER'],
  })
  role: string;

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Fecha de último login',
    example: '2024-01-15T10:30:00Z',
    nullable: true,
  })
  last_login?: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updated_at: string;

  @ApiProperty({
    description: 'Fecha de eliminación (soft delete)',
    example: null,
    nullable: true,
  })
  deleted_at: string | null;
}

export class PaginationSchema {
  @ApiProperty({
    description: 'Número total de registros',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Número de registros por página',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 8,
  })
  totalPages: number;
}

export class ApiResponseSchema<T> {
  @ApiProperty({
    description: 'Estado de la respuesta',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Datos de la respuesta',
    type: 'object',
    additionalProperties: true,
  })
  data: T;

  @ApiProperty({
    description: 'Mensaje descriptivo',
    example: 'Operación realizada exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp de la respuesta',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta del endpoint',
    example: '/api/v1/books',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP',
    example: 'GET',
  })
  method: string;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;
}

export class ErrorResponseSchema {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp del error',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta del endpoint',
    example: '/api/v1/books',
  })
  path: string;
}

// Esquemas para autenticación
export class LoginDtoSchema {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'admin@cmpc.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  password: string;
}

export class PostLoginResponseSchema {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token de renovación JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: UserSchema,
  })
  user: UserSchema;
}

export class GetRefreshResponseSchema {
  @ApiProperty({
    description: 'Nuevo token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}

// Esquemas para DTOs de libros
export class CreateBookDtoSchema {
  @ApiProperty({
    description: 'Título del libro',
    example: 'El Quijote',
    minLength: 2,
    maxLength: 255,
  })
  title: string;

  @ApiProperty({
    description: 'Autor del libro',
    example: 'Miguel de Cervantes',
    minLength: 2,
    maxLength: 255,
  })
  author: string;

  @ApiProperty({
    description: 'Editorial del libro',
    example: 'Editorial Planeta',
    minLength: 2,
    maxLength: 255,
  })
  publisher: string;

  @ApiProperty({
    description: 'Precio del libro',
    example: 25.99,
    minimum: 0,
    maximum: 1000000,
  })
  price: number;

  @ApiProperty({
    description: 'Disponibilidad del libro',
    example: true,
  })
  availability: boolean;

  @ApiProperty({
    description: 'Género literario',
    example: 'Ficción',
    minLength: 2,
    maxLength: 100,
  })
  genre: string;

  @ApiProperty({
    description: 'URL de la imagen del libro',
    example: 'https://example.com/quijote.jpg',
    nullable: true,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Descripción del libro',
    example: 'Obra maestra de la literatura universal',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Stock disponible',
    example: 15,
    minimum: 0,
    default: 0,
  })
  stock?: number;
}

export class UpdateBookDtoSchema {
  @ApiProperty({
    description: 'Título del libro',
    example: 'El Quijote',
    minLength: 2,
    maxLength: 255,
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Autor del libro',
    example: 'Miguel de Cervantes',
    minLength: 2,
    maxLength: 255,
    required: false,
  })
  author?: string;

  @ApiProperty({
    description: 'Editorial del libro',
    example: 'Editorial Planeta',
    minLength: 2,
    maxLength: 255,
    required: false,
  })
  publisher?: string;

  @ApiProperty({
    description: 'Precio del libro',
    example: 25.99,
    minimum: 0,
    maximum: 1000000,
    required: false,
  })
  price?: number;

  @ApiProperty({
    description: 'Disponibilidad del libro',
    example: true,
    required: false,
  })
  availability?: boolean;

  @ApiProperty({
    description: 'Género literario',
    example: 'Ficción',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  genre?: string;

  @ApiProperty({
    description: 'URL de la imagen del libro',
    example: 'https://example.com/quijote.jpg',
    nullable: true,
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Descripción del libro',
    example: 'Obra maestra de la literatura universal',
    nullable: true,
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Stock disponible',
    example: 15,
    minimum: 0,
    required: false,
  })
  stock?: number;
}

export class SearchBooksDtoSchema {
  @ApiProperty({
    description: 'Parámetros de búsqueda',
    type: 'object',
    properties: {
      search: {
        type: 'string',
        description: 'Término de búsqueda general',
        example: 'ciencia ficción',
      },
      title: {
        type: 'string',
        description: 'Filtrar por título',
        example: 'El Quijote',
      },
      author: {
        type: 'string',
        description: 'Filtrar por autor',
        example: 'Miguel de Cervantes',
      },
      publisher: {
        type: 'string',
        description: 'Filtrar por editorial',
        example: 'Editorial Planeta',
      },
      genre: {
        type: 'string',
        description: 'Filtrar por género',
        example: 'Ficción',
      },
      minPrice: {
        type: 'number',
        description: 'Precio mínimo',
        example: 10,
      },
      maxPrice: {
        type: 'number',
        description: 'Precio máximo',
        example: 50,
      },
      availability: {
        type: 'boolean',
        description: 'Filtrar por disponibilidad',
        example: true,
      },
      page: {
        type: 'number',
        description: 'Número de página',
        example: 1,
        minimum: 1,
      },
      limit: {
        type: 'number',
        description: 'Registros por página',
        example: 20,
        minimum: 1,
        maximum: 100,
      },
      sortBy: {
        type: 'string',
        description: 'Campo para ordenar',
        example: 'title',
        enum: ['title', 'author', 'publisher', 'price', 'created_at'],
      },
      sortOrder: {
        type: 'string',
        description: 'Orden de clasificación',
        example: 'ASC',
        enum: ['ASC', 'DESC'],
      },
    },
  })
  query: {
    search?: string;
    title?: string;
    author?: string;
    publisher?: string;
    genre?: string;
    minPrice?: number;
    maxPrice?: number;
    availability?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
}

// Esquemas para DTOs de usuarios
export class CreateUserDtoSchema {
  @ApiProperty({
    description: 'Email del usuario (debe ser único)',
    example: 'usuario@cmpc.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    minLength: 2,
    maxLength: 100,
  })
  first_name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    minLength: 2,
    maxLength: 100,
  })
  last_name: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    example: 'USER',
    enum: ['ADMIN', 'LIBRARIAN', 'USER'],
    default: 'USER',
  })
  role?: string;
}

export class UpdateUserDtoSchema {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@cmpc.com',
    format: 'email',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  first_name?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  last_name?: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    example: 'USER',
    enum: ['ADMIN', 'LIBRARIAN', 'USER'],
    required: false,
  })
  role?: string;

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true,
    required: false,
  })
  is_active?: boolean;
}

// Esquemas para respuestas de archivos
export class FileUploadResponseSchema {
  @ApiProperty({
    description: 'Estado de la operación',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo',
    example: 'Imagen subida exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'URL pública de la imagen',
    example: 'https://storage.googleapis.com/bucket/image.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Nombre original del archivo',
    example: 'image.jpg',
  })
  originalName: string;

  @ApiProperty({
    description: 'Tamaño del archivo en bytes',
    example: 1024000,
  })
  size: number;

  @ApiProperty({
    description: 'Tipo MIME del archivo',
    example: 'image/jpeg',
  })
  mimeType: string;

  @ApiProperty({
    description: 'Nombre del archivo en el storage',
    example: 'books-1234567890-image.jpg',
  })
  fileName: string;

  @ApiProperty({
    description: 'Nombre del bucket de storage',
    example: 'cmpc-books-storage',
  })
  bucketName: string;
}

// Esquemas para estadísticas de auditoría
export class AuditLogStatsSchema {
  @ApiProperty({
    description: 'Número total de logs',
    example: 104,
  })
  totalLogs: number;

  @ApiProperty({
    description: 'Logs agrupados por acción',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        action: { type: 'string', example: 'READ' },
        count: { type: 'number', example: 45 },
      },
    },
  })
  logsByAction: Array<{ action: string; count: number }>;

  @ApiProperty({
    description: 'Logs agrupados por estado',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        count: { type: 'number', example: 98 },
      },
    },
  })
  logsByStatus: Array<{ status: string; count: number }>;

  @ApiProperty({
    description: 'Logs agrupados por nivel',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        level: { type: 'string', example: 'INFO' },
        count: { type: 'number', example: 95 },
      },
    },
  })
  logsByLevel: Array<{ level: string; count: number }>;

  @ApiProperty({
    description: 'Actividad reciente',
    type: 'array',
    items: { $ref: '#/components/schemas/AuditLog' },
  })
  recentActivity: AuditLogSchema[];
}

// Esquemas para opciones de filtro de inventario
export class InventoryFilterOptionsSchema {
  @ApiProperty({
    description: 'Géneros disponibles',
    type: 'array',
    items: { type: 'string' },
    example: ['Ficción', 'No Ficción', 'Ciencia Ficción'],
  })
  genres: string[];

  @ApiProperty({
    description: 'Editoriales disponibles',
    type: 'array',
    items: { type: 'string' },
    example: ['Editorial Planeta', 'Santillana', 'Alfaguara'],
  })
  publishers: string[];

  @ApiProperty({
    description: 'Autores disponibles',
    type: 'array',
    items: { type: 'string' },
    example: ['Gabriel García Márquez', 'Mario Vargas Llosa'],
  })
  authors: string[];
}
