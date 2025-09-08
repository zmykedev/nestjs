import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { of } from 'rxjs';
import {
  ResponseInterceptor,
  ErrorResponseInterceptor,
  ApiResponseHelper,
  ApiResponse,
} from '../response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);

    mockRequest = {
      method: 'GET',
      url: '/api/v1/books',
      route: { path: '/api/v1/books' },
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

  it('should transform GET request response', (done) => {
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response: ApiResponse<any>) => {
        expect(response.status).toBe(true);
        expect(response.data).toEqual(mockData);
        expect(response.message).toBe('Registros obtenidos exitosamente');
        expect(response.method).toBe('GET');
        expect(response.path).toBe('/api/v1/books');
        expect(response.statusCode).toBe(200);
        expect(response.timestamp).toBeDefined();
        done();
      },
    });
  });

  it('should transform GET by ID request response', (done) => {
    mockRequest.route.path = '/api/v1/books/:id';
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response: ApiResponse<any>) => {
        expect(response.message).toBe('Registro encontrado exitosamente');
        done();
      },
    });
  });

  it('should transform POST request response', (done) => {
    mockRequest.method = 'POST';
    const mockData = { id: 1, title: 'New Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response: ApiResponse<any>) => {
        expect(response.message).toBe('Registro creado exitosamente');
        expect(response.method).toBe('POST');
        done();
      },
    });
  });

  it('should transform PUT request response', (done) => {
    mockRequest.method = 'PUT';
    const mockData = { id: 1, title: 'Updated Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response: ApiResponse<any>) => {
        expect(response.message).toBe('Registro actualizado exitosamente');
        expect(response.method).toBe('PUT');
        done();
      },
    });
  });

  it('should transform PATCH request response', (done) => {
    mockRequest.method = 'PATCH';
    const mockData = { id: 1, title: 'Patched Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response: ApiResponse<any>) => {
        expect(response.message).toBe('Registro actualizado exitosamente');
        expect(response.method).toBe('PATCH');
        done();
      },
    });
  });

  it('should transform DELETE request response', (done) => {
    mockRequest.method = 'DELETE';
    const mockData = { id: 1 };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response: ApiResponse<any>) => {
        expect(response.message).toBe('Registro eliminado exitosamente');
        expect(response.method).toBe('DELETE');
        done();
      },
    });
  });

  it('should handle null data', (done) => {
    mockCallHandler.handle.mockReturnValue(of(null));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response: ApiResponse<any>) => {
        expect(response.data).toBeNull();
        expect(response.status).toBe(true);
        done();
      },
    });
  });

  it('should handle paginated data', (done) => {
    const mockPaginatedData = {
      items: [{ id: 1, title: 'Book 1' }, { id: 2, title: 'Book 2' }],
      meta: {
        page: 1,
        limit: 10,
        total: 25,
      },
    };
    mockCallHandler.handle.mockReturnValue(of(mockPaginatedData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response: ApiResponse<any>) => {
        expect(response.data).toEqual(mockPaginatedData.items);
        expect(response.pagination).toEqual({
          page: 1,
          limit: 10,
          total: 25,
          totalPages: 3,
        });
        done();
      },
    });
  });

  it('should handle request without route path', (done) => {
    mockRequest.route = undefined;
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response: ApiResponse<any>) => {
        expect(response.path).toBe('/api/v1/books');
        done();
      },
    });
  });
});

describe('ErrorResponseInterceptor', () => {
  let interceptor: ErrorResponseInterceptor;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorResponseInterceptor],
    }).compile();

    interceptor = module.get<ErrorResponseInterceptor>(ErrorResponseInterceptor);

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/api/v1/books',
          route: { path: '/api/v1/books' },
        }),
      }),
    } as any;

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  it('should transform error response', (done) => {
    const mockErrorData = {
      statusCode: 400,
      message: 'Bad Request',
      errors: ['Field is required'],
    };
    mockCallHandler.handle.mockReturnValue(of(mockErrorData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response) => {
        expect(response.status).toBe(false);
        expect(response.data).toBeNull();
        expect(response.message).toBe('Bad Request');
        expect(response.statusCode).toBe(400);
        expect(response.errors).toEqual(['Field is required']);
        done();
      },
    });
  });

  it('should not transform non-error response', (done) => {
    const mockData = { id: 1, title: 'Test Book' };
    mockCallHandler.handle.mockReturnValue(of(mockData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response) => {
        expect(response).toEqual(mockData);
        done();
      },
    });
  });
});

describe('ApiResponseHelper', () => {
  it('should create success response', () => {
    const data = { id: 1, title: 'Test Book' };
    const response = ApiResponseHelper.success(data, 'Test message', 201);

    expect(response.status).toBe(true);
    expect(response.data).toEqual(data);
    expect(response.message).toBe('Test message');
    expect(response.statusCode).toBe(201);
    expect(response.timestamp).toBeDefined();
  });

  it('should create success response with default values', () => {
    const data = { id: 1, title: 'Test Book' };
    const response = ApiResponseHelper.success(data);

    expect(response.status).toBe(true);
    expect(response.data).toEqual(data);
    expect(response.message).toBe('Operación exitosa');
    expect(response.statusCode).toBe(200);
  });

  it('should create error response', () => {
    const response = ApiResponseHelper.error('Test error', 400, ['Error 1', 'Error 2']);

    expect(response.status).toBe(false);
    expect(response.data).toBeNull();
    expect(response.message).toBe('Test error');
    expect(response.statusCode).toBe(400);
    expect(response.errors).toEqual(['Error 1', 'Error 2']);
  });

  it('should create error response with default values', () => {
    const response = ApiResponseHelper.error('Test error');

    expect(response.status).toBe(false);
    expect(response.data).toBeNull();
    expect(response.message).toBe('Test error');
    expect(response.statusCode).toBe(400);
    expect(response.errors).toBeUndefined();
  });
});
