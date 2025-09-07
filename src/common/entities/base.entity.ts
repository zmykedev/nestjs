import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Index,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Index()
  deleted_at: Date;

  // Métodos helper para soft delete
  softDelete(): void {
    this.deleted_at = new Date();
    this.is_active = false;
  }

  restore(): void {
    this.deleted_at = null;
    this.is_active = true;
  }

  isDeleted(): boolean {
    return this.deleted_at !== null;
  }

  isActive(): boolean {
    return this.is_active && !this.isDeleted();
  }
}

// Decorator para aplicar índices comunes
export function CommonIndices() {
  return function (target: any) {
    // Los índices ya están definidos en la entidad base
  };
}
