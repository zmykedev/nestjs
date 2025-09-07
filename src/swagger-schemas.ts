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
