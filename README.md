# Backend Template - NestJS

Un template limpio y moderno para iniciar proyectos backend con NestJS, incluyendo autenticación JWT, gestión de usuarios.

## 🚀 Características

- **Autenticación JWT**: Login, registro y refresh tokens
- **Gestión de Usuarios**: CRUD completo con roles (Admin, User)
- **Auditoría**: Logs automáticos de todas las acciones
- **Storage**: Integración con servicios de almacenamiento de archivos
- **Base de Datos**: Configuración con PostgreSQL y TypeOrm
- **Documentación**: Swagger/OpenAPI integrado
- **Testing**: Configuración completa de Jest
- **Linting**: ESLint y Prettier configurados

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 12+
- pnpm (recomendado) o npm

## 🛠️ Instalación

1. **Clonar el template**:
   ```bash
   git clone <repository-url>
   cd nestjs-template
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   # Database
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=your_database

   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret

   # Storage (opcional)
   IMGBB_API_KEY=your_imgbb_key
   ```

4. **Ejecutar migraciones**:
   ```bash
   npm run migration:run
   ```

5. **Iniciar el servidor**:
   ```bash
   # Desarrollo
   npm run start:dev
   
   # Producción
   npm run build
   npm run start:prod
   ```

## 📚 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Cerrar sesión

### Usuarios
- `GET /users` - Listar usuarios (requiere autenticación)
- `GET /users/:id` - Obtener usuario por ID
- `POST /users` - Crear usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

## 📖 Documentación

Una vez iniciado el servidor, la documentación de la API estará disponible en:
- Swagger UI: `http://localhost:3000/docs`

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── controllers/      # Controladores de auth
│   ├── guards/          # Guards de autenticación
│   ├── strategies/      # Estrategias de Passport
│   └── services/        # Servicios de auth
├── users/               # Módulo de usuarios
│   ├── controllers/     # Controladores de usuarios
│   ├── dto/            # DTOs de usuarios
│   ├── entities/       # Entidades de TypeORM
│   └── services/       # Servicios de usuarios
├── common/             # Módulos comunes
│   ├── interceptors/   # Interceptores globales
│   ├── filters/        # Filtros de excepción
│   └── services/       # Servicios comunes
├── storage/            # Módulo de almacenamiento
├── migrations/         # Migraciones de base de datos
└── utils/              # Utilidades
```

## 🔧 Scripts Disponibles

- `npm run start` - Iniciar servidor
- `npm run start:dev` - Iniciar en modo desarrollo
- `npm run start:debug` - Iniciar en modo debug
- `npm run build` - Compilar para producción
- `npm run test` - Ejecutar tests
- `npm run test:watch` - Tests en modo watch
- `npm run test:cov` - Tests con coverage
- `npm run lint` - Ejecutar linter
- `npm run format` - Formatear código

## 🚀 Despliegue

El template incluye configuración para Railway. Para desplegar:

1. Conectar tu repositorio a Railway
2. Configurar las variables de entorno en Railway
3. El despliegue se realizará automáticamente

## 📝 Licencia

Este template es de uso libre para proyectos personales y comerciales.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**Desarrollado por Maikol Zapata** 🚀
