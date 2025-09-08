import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuditLogController } from '../audit-log.controller';
import { AuditLogService } from '../../services/audit-log.service.sequelize';
import { QueryAuditLogDto } from '../../services/audit-log.service.sequelize';
import {
  AuditLogAction,
  AuditLogStatus,
  AuditLogLevel,
} from '../../models/audit-log.model';

describe('AuditLogController', () => {
  let controller: AuditLogController;
  let auditLogService: jest.Mocked<AuditLogService>;

  beforeEach(async () => {
    const mockAuditLogService = {
      findAll: jest.fn(),
      getStats: jest.fn(),
      exportToCSV: jest.fn(),
      exportInventoryToCSV: jest.fn(),
      getInventoryFilterOptions: jest.fn(),
      deleteAllLogs: jest.fn(),
      updateMetadataForExistingLogs: jest.fn(),
      cleanupOldLogs: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditLogController],
      providers: [
        {
          provide: AuditLogService,
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    controller = module.get<AuditLogController>(AuditLogController);
    auditLogService = module.get(AuditLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return audit logs with success response', async () => {
      const queryDto: QueryAuditLogDto = {
        page: 1,
        limit: 20,
        search: 'test',
      };

      const mockResult = {
        logs: [
          {
            id: 1,
            userId: 1,
            action: 'CREATE',
            resource: 'Book',
            status: 'SUCCESS',
            level: 'INFO',
            createdAt: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };

      auditLogService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(queryDto);

      expect(auditLogService.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual({
        status: 'success',
        data: mockResult,
        message: 'Audit logs retrieved successfully',
      });
    });

    it('should handle errors and re-throw them', async () => {
      const queryDto: QueryAuditLogDto = { page: 1, limit: 20 };
      const error = new Error('Database error');

      auditLogService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(queryDto)).rejects.toThrow(error);
      expect(auditLogService.findAll).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('getStats', () => {
    it('should return audit log statistics', async () => {
      const mockStats = {
        totalLogs: 100,
        logsByAction: [
          { action: 'CREATE', count: 25 },
          { action: 'READ', count: 50 },
        ],
        logsByStatus: [
          { status: 'SUCCESS', count: 95 },
          { status: 'FAILED', count: 5 },
        ],
        logsByLevel: [
          { level: 'INFO', count: 90 },
          { level: 'ERROR', count: 10 },
        ],
        recentActivity: [],
      };

      auditLogService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(auditLogService.getStats).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'success',
        data: mockStats,
        message: 'Audit log statistics retrieved successfully',
      });
    });

    it('should handle errors in getStats', async () => {
      const error = new Error('Stats error');
      auditLogService.getStats.mockRejectedValue(error);

      await expect(controller.getStats()).rejects.toThrow(error);
    });
  });

  describe('getActions', () => {
    it('should return available actions, statuses, and levels', async () => {
      const result = await controller.getActions();

      expect(result).toEqual({
        status: 'success',
        data: {
          actions: Object.values(AuditLogAction),
          statuses: Object.values(AuditLogStatus),
          levels: Object.values(AuditLogLevel),
        },
        message: 'Audit log actions retrieved successfully',
      });
    });

    it('should handle errors in getActions', async () => {
      // Mock Object.values to throw an error
      const originalValues = Object.values;
      Object.values = jest.fn().mockImplementation(() => {
        throw new Error('Object.values error');
      });

      await expect(controller.getActions()).rejects.toThrow('Object.values error');

      // Restore original function
      Object.values = originalValues;
    });
  });

  describe('exportToCSV', () => {
    it('should export audit logs to CSV', async () => {
      const queryDto: QueryAuditLogDto = { page: 1, limit: 100 };
      const mockCsv = 'id,action,resource,status\n1,CREATE,Book,SUCCESS';
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      auditLogService.exportToCSV.mockResolvedValue(mockCsv);

      await controller.exportToCSV(queryDto, mockResponse);

      expect(auditLogService.exportToCSV).toHaveBeenCalledWith(queryDto);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        expect.stringContaining('attachment; filename="audit-logs-'),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(mockCsv);
    });

    it('should handle errors in exportToCSV', async () => {
      const queryDto: QueryAuditLogDto = { page: 1, limit: 100 };
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;
      const error = new Error('Export error');

      auditLogService.exportToCSV.mockRejectedValue(error);

      await expect(controller.exportToCSV(queryDto, mockResponse)).rejects.toThrow(error);
    });
  });

  describe('exportInventoryToCSV', () => {
    it('should export inventory audit logs to CSV', async () => {
      const queryDto: QueryAuditLogDto = { action: 'INVENTORY_ADDED' };
      const mockCsv = 'id,action,resource,status\n1,INVENTORY_ADDED,Book,SUCCESS';
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      auditLogService.exportInventoryToCSV.mockResolvedValue(mockCsv);

      await controller.exportInventoryToCSV(queryDto, mockResponse);

      expect(auditLogService.exportInventoryToCSV).toHaveBeenCalledWith(queryDto);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        expect.stringContaining('attachment; filename="inventory-logs-'),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(mockCsv);
    });
  });

  describe('getInventoryLogs', () => {
    it('should return inventory audit logs', async () => {
      const queryDto: QueryAuditLogDto = { page: 1, limit: 20 };
      const mockResult = {
        logs: [
          {
            id: 1,
            action: 'INVENTORY_ADDED',
            resource: 'Book',
            status: 'SUCCESS',
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };

      auditLogService.findAll.mockResolvedValue(mockResult);

      const result = await controller.getInventoryLogs(queryDto);

      expect(auditLogService.findAll).toHaveBeenCalledWith({
        ...queryDto,
        entity_type: 'Book',
        action: queryDto.action || undefined,
      });
      expect(result).toEqual({
        status: 'success',
        data: mockResult,
        message: 'Inventory audit logs retrieved successfully',
      });
    });

    it('should handle errors in getInventoryLogs', async () => {
      const queryDto: QueryAuditLogDto = { page: 1, limit: 20 };
      const error = new Error('Inventory logs error');

      auditLogService.findAll.mockRejectedValue(error);

      await expect(controller.getInventoryLogs(queryDto)).rejects.toThrow(error);
    });
  });

  describe('getInventoryFilterOptions', () => {
    it('should return inventory filter options', async () => {
      const mockOptions = {
        genres: ['Ficción', 'No Ficción'],
        publishers: ['Editorial Planeta', 'Santillana'],
        authors: ['Gabriel García Márquez', 'Mario Vargas Llosa'],
      };

      auditLogService.getInventoryFilterOptions.mockResolvedValue(mockOptions);

      const result = await controller.getInventoryFilterOptions();

      expect(auditLogService.getInventoryFilterOptions).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'success',
        data: mockOptions,
        message: 'Filter options retrieved successfully',
      });
    });
  });

  describe('deleteAllLogs', () => {
    it('should delete all audit logs', async () => {
      const deletedCount = 150;
      auditLogService.deleteAllLogs.mockResolvedValue(deletedCount);

      const result = await controller.deleteAllLogs();

      expect(auditLogService.deleteAllLogs).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'success',
        data: deletedCount,
        message: 'All audit logs deleted successfully',
      });
    });

    it('should handle errors in deleteAllLogs', async () => {
      const error = new Error('Delete error');
      auditLogService.deleteAllLogs.mockRejectedValue(error);

      await expect(controller.deleteAllLogs()).rejects.toThrow(error);
    });
  });

  describe('updateMetadata', () => {
    it('should update metadata for existing logs', async () => {
      const updatedCount = 25;
      auditLogService.updateMetadataForExistingLogs.mockResolvedValue(updatedCount);

      const result = await controller.updateMetadata();

      expect(auditLogService.updateMetadataForExistingLogs).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'success',
        data: updatedCount,
        message: 'Metadata updated successfully',
      });
    });
  });

  describe('cleanupOldLogs', () => {
    it('should cleanup old logs with default days', async () => {
      const deletedCount = 45;
      auditLogService.cleanupOldLogs.mockResolvedValue(deletedCount);

      const result = await controller.cleanupOldLogs();

      expect(auditLogService.cleanupOldLogs).toHaveBeenCalledWith(90);
      expect(result).toEqual({
        status: 'success',
        data: { deletedCount },
        message: 'Successfully cleaned up 45 old audit logs',
      });
    });

    it('should cleanup old logs with custom days', async () => {
      const deletedCount = 30;
      auditLogService.cleanupOldLogs.mockResolvedValue(deletedCount);

      const result = await controller.cleanupOldLogs('30');

      expect(auditLogService.cleanupOldLogs).toHaveBeenCalledWith(30);
      expect(result).toEqual({
        status: 'success',
        data: { deletedCount },
        message: 'Successfully cleaned up 30 old audit logs',
      });
    });

    it('should handle errors in cleanupOldLogs', async () => {
      const error = new Error('Cleanup error');
      auditLogService.cleanupOldLogs.mockRejectedValue(error);

      await expect(controller.cleanupOldLogs()).rejects.toThrow(error);
    });
  });
});
