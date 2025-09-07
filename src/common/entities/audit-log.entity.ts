import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

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

@Entity('audit_logs')
@Index(['user_id', 'created_at'])
@Index(['entity_type', 'entity_id'])
@Index(['action', 'created_at'])
@Index(['status', 'created_at'])
@Index(['level', 'created_at'])
export class AuditLog extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  user_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  user_email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  user_name: string;

  @Column({ type: 'varchar', length: 50 })
  @Index()
  action: AuditLogAction;

  @Column({ type: 'varchar', length: 100, nullable: true })
  entity_type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  entity_id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  request_data: any;

  @Column({ type: 'jsonb', nullable: true })
  response_data: any;

  @Column({ type: 'varchar', length: 20, default: AuditLogStatus.SUCCESS })
  @Index()
  status: AuditLogStatus;

  @Column({ type: 'varchar', length: 20, default: AuditLogLevel.INFO })
  @Index()
  level: AuditLogLevel;

  @Column({ type: 'varchar', length: 500, nullable: true })
  ip_address: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  user_agent: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  endpoint: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  http_method: string;

  @Column({ type: 'integer', nullable: true })
  response_time_ms: number;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;
}
