import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

export enum AuditLogAction {
  // Acciones de inventario de libros
  INVENTORY_ADDED = 'INVENTORY_ADDED',
  INVENTORY_UPDATED = 'INVENTORY_UPDATED',
  INVENTORY_REMOVED = 'INVENTORY_REMOVED',
  INVENTORY_VIEWED = 'INVENTORY_VIEWED',
  INVENTORY_SEARCHED = 'INVENTORY_SEARCHED',

  // Acciones generales (mantener para compatibilidad)
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  SEARCH = 'SEARCH',
  FILTER = 'FILTER',
  SORT = 'SORT',
  PAGINATION = 'PAGINATION',
}

export enum AuditLogStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING',
}

export enum AuditLogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

@Table({
  tableName: 'audit_logs',
  timestamps: true,
  paranoid: false, // Disabled until deleted_at column is added via migration
  underscored: false,
  indexes: [
    { fields: ['action'] },
    { fields: ['status'] },
    { fields: ['level'] },
    { fields: ['entity_type'] },
    { fields: ['user_id'] },
    { fields: ['created_at'] }, // Use actual column name
  ],
})
export class AuditLog extends Model<AuditLog> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  user_email: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  user_name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  action: AuditLogAction;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  entity_type: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  entity_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  request_data: any;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  response_data: any;

  @Column({
    type: DataType.STRING(20),
    defaultValue: AuditLogStatus.SUCCESS,
  })
  status: AuditLogStatus;

  @Column({
    type: DataType.STRING(20),
    defaultValue: AuditLogLevel.INFO,
  })
  level: AuditLogLevel;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  ip_address: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  user_agent: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  endpoint: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  http_method: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  response_time_ms: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  error_message: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: any;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at', // Map to existing column name
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'updated_at', // Map to existing column name
  })
  updatedAt: Date;

  // deletedAt column will be added via migration later
  // @Column({
  //   type: DataType.DATE,
  //   allowNull: true,
  //   field: 'deleted_at',
  // })
  // deletedAt: Date;

  // Métodos helper para soft delete - will be enabled after migration
  // softDelete(): void {
  //   this.deletedAt = new Date();
  //   this.is_active = false;
  // }

  // restoreRecord(): void {
  //   this.deletedAt = null;
  //   this.is_active = true;
  // }

  // isDeleted(): boolean {
  //   return this.deletedAt !== null;
  // }

  isActive(): boolean {
    return this.is_active;
  }
}
