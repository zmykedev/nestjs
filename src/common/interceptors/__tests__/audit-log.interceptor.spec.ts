import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AuditLogInterceptor } from '../audit-log.interceptor';
import { AuditLogService } from '../../services/audit-log.service.sequelize';
import { BooksService } from '../../../books/services/books.service.sequelize';
import { Request, Response } from 'express';

describe('AuditLogInterceptor', () => {
  let interceptor: AuditLogInterceptor;
  let auditLogService: jest.Mocked<AuditLogService>;
  let booksService: jest.Mocked<BooksService>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const mockAuditLogService = {
      create: jest.fn(),
    };

    const mockBooksService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogInterceptor,
        {
          provide: AuditLogService,
          useValue: mockAuditLogService,
        },
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    interceptor = module.get<AuditLogInterceptor>(AuditLogInterceptor);
    auditLogService = module.get(AuditLogService);
    booksService = module.get(BooksService);

    mockRequest = {
      method: 'GET',
      url: '/api/v1/books',
      route: { path: '/api/v1/books' },
      body: { title: 'Test Book' },
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('Mozilla/5.0'),
    };

    mockResponse = {
      statusCode: 200,
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as any;

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log successful request', async (done) => {
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));
    auditLogService.create.mockResolvedValue(undefined);

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      next: (data) => {
        expect(data).toEqual(mockData);
        expect(auditLogService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 1,
            userEmail: 'test@example.com',
            userName: 'John Doe',
            action: expect.any(String),
            resource: expect.any(String),
            status: 'SUCCESS',
            level: 'INFO',
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0',
          }),
        );
        done();
      },
    });
  });

  it('should log failed request', async (done) => {
    const mockError = new Error('Test error') as any;
    mockError.status = 400;
    mockCallHandler.handle.mockReturnValue(throwError(() => mockError));
    auditLogService.create.mockResolvedValue(undefined);

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      error: (error) => {
        expect(error).toBe(mockError);
        expect(auditLogService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 1,
            userEmail: 'test@example.com',
            userName: 'John Doe',
            action: expect.any(String),
            resource: expect.any(String),
            status: 'FAILED',
            level: 'ERROR',
            errorMessage: 'Test error',
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0',
          }),
        );
        done();
      },
    });
  });

  it('should handle request without user', async (done) => {
    mockRequest.user = undefined;
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));
    auditLogService.create.mockResolvedValue(undefined);

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      next: () => {
        expect(auditLogService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: undefined,
            userEmail: undefined,
            userName: undefined,
          }),
        );
        done();
      },
    });
  });

  it('should determine correct action for GET request', async (done) => {
    mockRequest.method = 'GET';
    mockRequest.route.path = '/api/v1/books';
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));
    auditLogService.create.mockResolvedValue(undefined);

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      next: () => {
        expect(auditLogService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'READ',
          }),
        );
        done();
      },
    });
  });

  it('should determine correct action for POST request', async (done) => {
    mockRequest.method = 'POST';
    mockRequest.route.path = '/api/v1/books';
    const mockData = { id: 1, title: 'New Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));
    auditLogService.create.mockResolvedValue(undefined);

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      next: () => {
        expect(auditLogService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'CREATE',
          }),
        );
        done();
      },
    });
  });

  it('should determine correct action for PUT request', async (done) => {
    mockRequest.method = 'PUT';
    mockRequest.route.path = '/api/v1/books/1';
    const mockData = { id: 1, title: 'Updated Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));
    auditLogService.create.mockResolvedValue(undefined);

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      next: () => {
        expect(auditLogService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'UPDATE',
          }),
        );
        done();
      },
    });
  });

  it('should determine correct action for DELETE request', async (done) => {
    mockRequest.method = 'DELETE';
    mockRequest.route.path = '/api/v1/books/1';
    const mockData = { id: 1 };
    mockCallHandler.handle.mockReturnValue(of(mockData));
    auditLogService.create.mockResolvedValue(undefined);

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      next: () => {
        expect(auditLogService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'DELETE',
          }),
        );
        done();
      },
    });
  });

  it('should handle user with only username', async (done) => {
    mockRequest.user = {
      id: 1,
      email: 'test@example.com',
      username: 'johndoe',
    };
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));
    auditLogService.create.mockResolvedValue(undefined);

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      next: () => {
        expect(auditLogService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            userName: 'johndoe',
          }),
        );
        done();
      },
    });
  });

  it('should handle user with sub instead of id', async (done) => {
    mockRequest.user = {
      sub: '123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));
    auditLogService.create.mockResolvedValue(undefined);

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      next: () => {
        expect(auditLogService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 123,
          }),
        );
        done();
      },
    });
  });

  it('should handle error without status', async (done) => {
    const mockError = new Error('Test error');
    // No status property
    mockCallHandler.handle.mockReturnValue(throwError(() => mockError));
    auditLogService.create.mockResolvedValue(undefined);

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      error: (error) => {
        expect(error).toBe(mockError);
        expect(auditLogService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'FAILED',
            level: 'ERROR',
            errorMessage: 'Test error',
          }),
        );
        done();
      },
    });
  });

  it('should not fail if audit log creation fails', async (done) => {
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));
    auditLogService.create.mockRejectedValue(new Error('Audit log failed'));

    const observable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
    observable.subscribe({
      next: (data) => {
        expect(data).toEqual(mockData);
        done();
      },
    });
  });
});
