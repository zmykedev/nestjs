import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLog } from './models/audit-log.model';
import { AuditLogService } from './services/audit-log.service.sequelize';
import { AuditLogController } from './controllers/audit-log.controller';

@Module({
  imports: [SequelizeModule.forFeature([AuditLog])],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
