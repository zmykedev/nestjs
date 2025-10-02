import { ApiProperty } from '@nestjs/swagger';

// Esquemas personalizados para Swagger

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
    enum: ['ADMIN', 'USER'],
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
    example: '/api/v1/users',
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
    example: '/api/v1/users',
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

// Esquemas para DTOs de usuarios
export class CreateUserDtoSchema {
  @ApiProperty({
    description: 'Email del usuario (debe ser único)',
    example: 'user@example.com',
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
    enum: ['ADMIN', 'USER'],
    default: 'USER',
  })
  role?: string;
}

export class UpdateUserDtoSchema {
  @ApiProperty({
    description: 'Email del usuario (debe ser único)',
    example: 'user@example.com',
    format: 'email',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'newpassword123',
    minLength: 6,
    required: false,
  })
  password?: string;

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
    enum: ['ADMIN', 'USER'],
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
