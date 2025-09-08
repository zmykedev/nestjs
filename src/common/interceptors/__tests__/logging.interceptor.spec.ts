import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { LoggingInterceptor } from '../logging.interceptor';
import { Request, Response } from 'express';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);

    mockRequest = {
      method: 'GET',
      url: '/api/v1/books',
      body: { title: 'Test Book' },
      user: { id: 1, email: 'test@example.com' },
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

  it('should log request and response for successful request', (done) => {
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    const loggerSpy = jest.spyOn(interceptor['logger'], 'log');
    const loggerDebugSpy = jest.spyOn(interceptor['logger'], 'debug');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (data) => {
        expect(data).toEqual(mockData);
        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringContaining('Incoming GET /api/v1/books'),
        );
        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringContaining('Outgoing GET /api/v1/books'),
        );
        expect(loggerDebugSpy).toHaveBeenCalledWith(
          expect.stringContaining('Request Body:'),
        );
        done();
      },
    });
  });

  it('should log request without body when body is empty', (done) => {
    mockRequest.body = {};
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    const loggerSpy = jest.spyOn(interceptor['logger'], 'log');
    const loggerDebugSpy = jest.spyOn(interceptor['logger'], 'debug');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        expect(loggerSpy).toHaveBeenCalled();
        expect(loggerDebugSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('Request Body:'),
        );
        done();
      },
    });
  });

  it('should log error for failed request', (done) => {
    const mockError = new Error('Test error') as any;
    mockError.status = 400;
    mockCallHandler.handle.mockReturnValue(throwError(() => mockError));

    const loggerErrorSpy = jest.spyOn(interceptor['logger'], 'error');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: (error) => {
        expect(error).toBe(mockError);
        expect(loggerErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Error GET /api/v1/books'),
          mockError.stack,
        );
        done();
      },
    });
  });

  it('should handle request without user', (done) => {
    mockRequest.user = undefined;
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    const loggerSpy = jest.spyOn(interceptor['logger'], 'log');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringContaining('User: anonymous'),
        );
        done();
      },
    });
  });

  it('should sanitize sensitive data in request body', (done) => {
    mockRequest.body = {
      title: 'Test Book',
      password: 'secret123',
      token: 'abc123',
      email: 'test@example.com',
    };

    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    const loggerDebugSpy = jest.spyOn(interceptor['logger'], 'debug');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        expect(loggerDebugSpy).toHaveBeenCalledWith(
          expect.stringContaining('[REDACTED]'),
        );
        expect(loggerDebugSpy).toHaveBeenCalledWith(
          expect.not.stringContaining('secret123'),
        );
        expect(loggerDebugSpy).toHaveBeenCalledWith(
          expect.not.stringContaining('abc123'),
        );
        done();
      },
    });
  });

  it('should log response data in development environment', (done) => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    const loggerDebugSpy = jest.spyOn(interceptor['logger'], 'debug');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        expect(loggerDebugSpy).toHaveBeenCalledWith(
          expect.stringContaining('Response Data:'),
        );
        process.env.NODE_ENV = originalEnv;
        done();
      },
    });
  });

  it('should not log response data in production environment', (done) => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    const loggerDebugSpy = jest.spyOn(interceptor['logger'], 'debug');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        const responseDataLogs = loggerDebugSpy.mock.calls.filter(call =>
          call[0].includes('Response Data:')
        );
        expect(responseDataLogs).toHaveLength(0);
        process.env.NODE_ENV = originalEnv;
        done();
      },
    });
  });

  it('should handle error without status code', (done) => {
    const mockError = new Error('Test error');
    // No status property
    mockCallHandler.handle.mockReturnValue(throwError(() => mockError));

    const loggerErrorSpy = jest.spyOn(interceptor['logger'], 'error');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: (error) => {
        expect(error).toBe(mockError);
        expect(loggerErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Status: 500'),
          mockError.stack,
        );
        done();
      },
    });
  });
});
