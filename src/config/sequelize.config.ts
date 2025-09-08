import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { config } from 'dotenv';

config();

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'cmpc_books',

  // Configuración de conexión
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000,
  },

  // Auto-discovery de modelos
  autoLoadModels: true,
  synchronize: process.env.NODE_ENV === 'development',

  // Logging
  logging: process.env.NODE_ENV === 'development' ? console.log : false,

  // Configuración adicional
  define: {
    timestamps: true,
    paranoid: true, // Para soft delete
    underscored: false, // camelCase en lugar de snake_case
    freezeTableName: true, // No pluralizar nombres de tabla
  },

  // Timezone
  timezone: '-03:00', // Chile timezone
};
