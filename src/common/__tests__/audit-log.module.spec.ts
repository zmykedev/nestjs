import { AuditLogModule } from '../audit-log.module';

describe('AuditLogModule', () => {
  it('should be defined', () => {
    expect(AuditLogModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof AuditLogModule).toBe('function');
  });

  it('should be instantiable', () => {
    const module = new AuditLogModule();
    expect(module).toBeDefined();
    expect(module).toBeInstanceOf(AuditLogModule);
  });
});
