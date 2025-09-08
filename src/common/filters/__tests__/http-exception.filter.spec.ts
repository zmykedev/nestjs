import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from '../http-exception.filter';
import { User } from '../../../users/models/user.model';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockRequest: Partial<Request & { user?: User }>;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: jest.Mocked<ArgumentsHost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    mockRequest = {
      url: '/api/v1/books',
      method: 'GET',
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      } as User,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        { message: 'Validation failed', error: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/api/v1/books',
        method: 'GET',
        message: 'Validation failed',
        error: 'Bad Request',
      });
    });

    it('should handle HttpException with string response', () => {
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: expect.any(String),
        path: '/api/v1/books',
        method: 'GET',
        message: 'Not found',
        error: 'Not found',
      });
    });

    it('should handle HttpException with null response', () => {
      const exception = new HttpException(null, HttpStatus.INTERNAL_SERVER_ERROR);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: '/api/v1/books',
        method: 'GET',
        message: expect.any(String),
        error: expect.any(String),
      });
    });

    it('should handle generic Error', () => {
      const exception = new Error('Database connection failed');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: '/api/v1/books',
        method: 'GET',
        message: 'Database connection failed',
        error: 'Error',
      });
    });

    it('should handle unknown exception', () => {
      const exception = 'Unknown error';

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: '/api/v1/books',
        method: 'GET',
        message: 'Internal server error',
        error: 'Internal Server Error',
      });
    });

    it('should handle request without user', () => {
      mockRequest.user = undefined;
      const exception = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        timestamp: expect.any(String),
        path: '/api/v1/books',
        method: 'GET',
        message: 'Unauthorized',
        error: 'Unauthorized',
      });
    });

    it('should include stack trace in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const exception = new Error('Test error');
      const stackTrace = exception.stack;

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: '/api/v1/books',
        method: 'GET',
        message: 'Test error',
        error: 'Error',
        stack: stackTrace,
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const exception = new Error('Test error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: '/api/v1/books',
        method: 'GET',
        message: 'Test error',
        error: 'Error',
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle HttpException with array message', () => {
      const exception = new HttpException(
        { message: ['Field is required', 'Invalid format'], error: 'Validation Error' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/api/v1/books',
        method: 'GET',
        message: ['Field is required', 'Invalid format'],
        error: 'Validation Error',
      });
    });

    it('should handle different HTTP methods', () => {
      mockRequest.method = 'POST';
      mockRequest.url = '/api/v1/users';
      
      const exception = new HttpException('Created', HttpStatus.CREATED);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.CREATED,
        timestamp: expect.any(String),
        path: '/api/v1/users',
        method: 'POST',
        message: 'Created',
        error: 'Created',
      });
    });

    it('should log error with correct context', () => {
      const loggerSpy = jest.spyOn(filter['logger'], 'error');
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Exception occurred: Test error - Status: 400 - Path: /api/v1/books - Method: GET - User: 1',
        undefined,
      );
    });

    it('should log error with stack trace for Error instances', () => {
      const loggerSpy = jest.spyOn(filter['logger'], 'error');
      const exception = new Error('Test error');
      const stackTrace = exception.stack;

      filter.catch(exception, mockArgumentsHost);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Exception occurred: Test error - Status: 500 - Path: /api/v1/books - Method: GET - User: 1',
        stackTrace,
      );
    });

    it('should log error with anonymous user when no user', () => {
      const loggerSpy = jest.spyOn(filter['logger'], 'error');
      mockRequest.user = undefined;
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Exception occurred: Test error - Status: 400 - Path: /api/v1/books - Method: GET - User: anonymous',
        undefined,
      );
    });
  });
});
