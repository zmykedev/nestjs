import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AuditLogService, CreateAuditLogDto, QueryAuditLogDto } from '../audit-log.service.sequelize';
import { AuditLog, AuditLogAction, AuditLogStatus, AuditLogLevel } from '../../models/audit-log.model';

describe('AuditLogService', () => {
  let service: AuditLogService;
  let auditLogModel: jest.Mocked<typeof AuditLog>;
  let sequelize: jest.Mocked<Sequelize>;

  beforeEach(async () => {
    const mockAuditLogModel = {
      create: jest.fn(),
      findAndCountAll: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      destroy: jest.fn(),
      update: jest.fn(),
    };

    const mockSequelize = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        {
          provide: getModelToken(AuditLog),
          useValue: mockAuditLogModel,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
    auditLogModel = module.get(getModelToken(AuditLog));
    sequelize = module.get(Sequelize);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an audit log successfully', async () => {
      const createDto: CreateAuditLogDto = {
        user_id: 1,
        user_email: 'test@example.com',
        action: AuditLogAction.CREATE,
        entity_type: 'Book',
        entity_id: '123',
        status: AuditLogStatus.SUCCESS,
        level: AuditLogLevel.INFO,
        description: 'Book created successfully',
      };

      const mockAuditLog = {
        id: 1,
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as AuditLog;

      auditLogModel.create.mockResolvedValue(mockAuditLog as any);

      const result = await service.create(createDto);

      expect(auditLogModel.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockAuditLog);
    });

    it('should handle errors when creating audit log', async () => {
      const createDto: CreateAuditLogDto = {
        action: AuditLogAction.CREATE,
        status: AuditLogStatus.SUCCESS,
        level: AuditLogLevel.INFO,
      };

      const error = new Error('Database error');
      auditLogModel.create.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should find all audit logs with default pagination', async () => {
      const queryDto: QueryAuditLogDto = {};
      const mockLogs = [
        {
          id: 1,
          action: AuditLogAction.CREATE,
          status: AuditLogStatus.SUCCESS,
          createdAt: new Date(),
        },
        {
          id: 2,
          action: AuditLogAction.READ,
          status: AuditLogStatus.SUCCESS,
          createdAt: new Date(),
        },
      ] as AuditLog[];

      const mockResult = {
        rows: mockLogs,
        count: 2,
      };

      auditLogModel.findAndCountAll.mockResolvedValue(mockResult as any);

      const result = await service.findAll(queryDto);

      expect(auditLogModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        order: [['createdAt', 'DESC']],
        limit: 50,
        offset: 0,
      });
      expect(result).toEqual({
        logs: mockLogs,
        total: 2,
        page: 1,
        limit: 50,
        totalPages: 1,
      });
    });

    it('should find audit logs with custom pagination', async () => {
      const queryDto: QueryAuditLogDto = {
        page: 2,
        limit: 10,
      };

      const mockLogs = [] as AuditLog[];
      const mockResult = {
        rows: mockLogs,
        count: 0,
      };

      auditLogModel.findAndCountAll.mockResolvedValue(mockResult as any);

      const result = await service.findAll(queryDto);

      expect(auditLogModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        order: [['createdAt', 'DESC']],
        limit: 10,
        offset: 10,
      });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
    });

    it('should find audit logs with filters', async () => {
      const queryDto: QueryAuditLogDto = {
        user_id: 1,
        action: AuditLogAction.CREATE,
        status: AuditLogStatus.SUCCESS,
        search: 'test',
      };

      const mockLogs = [] as AuditLog[];
      const mockResult = {
        rows: mockLogs,
        count: 0,
      };

      auditLogModel.findAndCountAll.mockResolvedValue(mockResult as any);

      await service.findAll(queryDto);

      expect(auditLogModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          action: AuditLogAction.CREATE,
          status: AuditLogStatus.SUCCESS,
          $or: [
            { description: { $iLike: '%test%' } },
            { user_name: { $iLike: '%test%' } },
            { user_email: { $iLike: '%test%' } },
            { entity_type: { $iLike: '%test%' } },
            { entity_id: { $iLike: '%test%' } },
          ],
        },
        order: [['createdAt', 'DESC']],
        limit: 50,
        offset: 0,
      });
    });

    it('should find audit logs with date range', async () => {
      const queryDto: QueryAuditLogDto = {
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      };

      const mockLogs = [] as AuditLog[];
      const mockResult = {
        rows: mockLogs,
        count: 0,
      };

      auditLogModel.findAndCountAll.mockResolvedValue(mockResult as any);

      await service.findAll(queryDto);

      expect(auditLogModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          createdAt: {
            $gte: new Date('2024-01-01'),
            $lte: new Date('2024-12-31'),
          },
        },
        order: [['createdAt', 'DESC']],
        limit: 50,
        offset: 0,
      });
    });

    it('should handle errors in findAll', async () => {
      const queryDto: QueryAuditLogDto = {};
      const error = new Error('Database error');

      auditLogModel.findAndCountAll.mockRejectedValue(error);

      await expect(service.findAll(queryDto)).rejects.toThrow(error);
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

      // Mock the sequelize.query calls
      sequelize.query
        .mockResolvedValueOnce([{ count: 100 }]) // totalLogs
        .mockResolvedValueOnce([{ action: 'CREATE', count: 25 }, { action: 'READ', count: 50 }]) // logsByAction
        .mockResolvedValueOnce([{ status: 'SUCCESS', count: 95 }, { status: 'FAILED', count: 5 }]) // logsByStatus
        .mockResolvedValueOnce([{ level: 'INFO', count: 90 }, { level: 'ERROR', count: 10 }]) // logsByLevel
        .mockResolvedValueOnce([]); // recentActivity

      const result = await service.getStats();

      expect(sequelize.query).toHaveBeenCalledTimes(5);
      expect(result).toEqual(mockStats);
    });

    it('should handle errors in getStats', async () => {
      const error = new Error('Database error');
      sequelize.query.mockRejectedValue(error);

      await expect(service.getStats()).rejects.toThrow(error);
    });
  });

  describe('exportToCSV', () => {
    it('should export audit logs to CSV format', async () => {
      const queryDto: QueryAuditLogDto = { page: 1, limit: 100 };
      const mockLogs = [
        {
          id: 1,
          action: 'CREATE',
          status: 'SUCCESS',
          user_name: 'John Doe',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 2,
          action: 'READ',
          status: 'SUCCESS',
          user_name: 'Jane Smith',
          createdAt: new Date('2024-01-02'),
        },
      ] as AuditLog[];

      const mockResult = {
        rows: mockLogs,
        count: 2,
      };

      auditLogModel.findAndCountAll.mockResolvedValue(mockResult as any);

      const result = await service.exportToCSV(queryDto);

      expect(auditLogModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        order: [['createdAt', 'DESC']],
        limit: 100,
        offset: 0,
      });
      expect(result).toContain('ID,Action,Status,User Name,Created At');
      expect(result).toContain('1,CREATE,SUCCESS,John Doe');
      expect(result).toContain('2,READ,SUCCESS,Jane Smith');
    });

    it('should handle errors in exportToCSV', async () => {
      const queryDto: QueryAuditLogDto = {};
      const error = new Error('Export error');

      auditLogModel.findAndCountAll.mockRejectedValue(error);

      await expect(service.exportToCSV(queryDto)).rejects.toThrow(error);
    });
  });

  describe('exportInventoryToCSV', () => {
    it('should export inventory audit logs to CSV', async () => {
      const queryDto: QueryAuditLogDto = { action: AuditLogAction.INVENTORY_ADDED };
      const mockLogs = [
        {
          id: 1,
          action: 'INVENTORY_ADDED',
          status: 'SUCCESS',
          entity_type: 'Book',
          metadata: { title: 'Test Book', author: 'Test Author' },
        },
      ] as AuditLog[];

      const mockResult = {
        rows: mockLogs,
        count: 1,
      };

      auditLogModel.findAndCountAll.mockResolvedValue(mockResult as any);

      const result = await service.exportInventoryToCSV(queryDto);

      expect(auditLogModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          action: AuditLogAction.INVENTORY_ADDED,
          entity_type: 'Book',
        },
        order: [['createdAt', 'DESC']],
        limit: 1000,
        offset: 0,
      });
      expect(result).toContain('ID,Action,Status,Entity Type,Title,Author');
    });
  });

  describe('getInventoryFilterOptions', () => {
    it('should return inventory filter options', async () => {
      const mockOptions = {
        genres: ['Ficción', 'No Ficción'],
        publishers: ['Editorial Planeta', 'Santillana'],
        authors: ['Gabriel García Márquez', 'Mario Vargas Llosa'],
      };

      sequelize.query
        .mockResolvedValueOnce([{ genre: 'Ficción' }, { genre: 'No Ficción' }])
        .mockResolvedValueOnce([{ publisher: 'Editorial Planeta' }, { publisher: 'Santillana' }])
        .mockResolvedValueOnce([{ author: 'Gabriel García Márquez' }, { author: 'Mario Vargas Llosa' }]);

      const result = await service.getInventoryFilterOptions();

      expect(sequelize.query).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockOptions);
    });
  });

  describe('deleteAllLogs', () => {
    it('should delete all audit logs', async () => {
      const deletedCount = 150;
      auditLogModel.destroy.mockResolvedValue(deletedCount as any);

      const result = await service.deleteAllLogs();

      expect(auditLogModel.destroy).toHaveBeenCalledWith({ where: {} });
      expect(result).toBe(deletedCount);
    });
  });

  describe('updateMetadataForExistingLogs', () => {
    it('should update metadata for existing logs', async () => {
      const updatedCount = 25;
      auditLogModel.update.mockResolvedValue([updatedCount] as any);

      const result = await service.updateMetadataForExistingLogs();

      expect(auditLogModel.update).toHaveBeenCalled();
      expect(result).toBe(updatedCount);
    });
  });

  describe('cleanupOldLogs', () => {
    it('should cleanup old logs', async () => {
      const deletedCount = 45;
      auditLogModel.destroy.mockResolvedValue(deletedCount as any);

      const result = await service.cleanupOldLogs(90);

      expect(auditLogModel.destroy).toHaveBeenCalledWith({
        where: {
          createdAt: {
            $lt: expect.any(Date),
          },
        },
      });
      expect(result).toBe(deletedCount);
    });
  });
});
