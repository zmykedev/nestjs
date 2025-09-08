import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { ImgBBService } from '../imgbb.service';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}));

// Mock fs
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

// Mock FormData
jest.mock('form-data', () => {
  return jest.fn().mockImplementation(() => ({
    append: jest.fn(),
    getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data' }),
  }));
});

describe('ImgBBService', () => {
  let service: ImgBBService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImgBBService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ImgBBService>(ImgBBService);
    configService = module.get(ConfigService);

    // Reset mocks
    jest.clearAllMocks();
    
    // Mock fs.readFileSync
    (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('mock-image-data'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize with API key from environment', () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      process.env.IMGBB_API_KEY = 'test-api-key';

      const newService = new ImgBBService(configService);
      expect(newService).toBeDefined();

      process.env.IMGBB_API_KEY = originalEnv;
    });

    it('should warn when API key is not configured', () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      delete process.env.IMGBB_API_KEY;

      const loggerSpy = jest.spyOn(console, 'warn').mockImplementation();

      new ImgBBService(configService);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('ImgBB API Key not configured'),
      );

      loggerSpy.mockRestore();
      process.env.IMGBB_API_KEY = originalEnv;
    });
  });

  describe('uploadImage', () => {
    const mockFilePath = '/path/to/image.jpg';
    const mockFileBuffer = Buffer.from('mock-image-data');
    const mockBase64Image = 'bW9jay1pbWFnZS1kYXRh';

    beforeEach(() => {
      // Mock fs.readFileSync
      (fs.readFileSync as jest.Mock).mockReturnValue(mockFileBuffer);
    });

    it('should upload image successfully', async () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      process.env.IMGBB_API_KEY = 'test-api-key';

      const mockResponse = {
        data: {
          success: true,
          data: {
            url: 'https://i.ibb.co/test/image.jpg',
            delete_url: 'https://ibb.co/delete/test',
            title: 'test-image',
            size: 1024,
          },
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.uploadImage(mockFilePath, 'test-image');

      expect((fs.readFileSync as jest.Mock)).toHaveBeenCalledWith(mockFilePath);
      expect((axios.post as jest.Mock)).toHaveBeenCalledWith(
        'https://api.imgbb.com/1/upload',
        expect.any(Object),
        expect.objectContaining({
          headers: expect.any(Object),
          timeout: 30000,
        }),
      );
      expect(result).toEqual({
        publicUrl: 'https://i.ibb.co/test/image.jpg',
        deleteUrl: 'https://ibb.co/delete/test',
        fileName: 'test-image',
        size: 1024,
      });

      process.env.IMGBB_API_KEY = originalEnv;
    });

    it('should throw error when API key is not configured', async () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      delete process.env.IMGBB_API_KEY;

      await expect(service.uploadImage(mockFilePath)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.uploadImage(mockFilePath)).rejects.toThrow(
        'ImgBB API Key is not configured',
      );

      process.env.IMGBB_API_KEY = originalEnv;
    });

    it('should throw error when ImgBB API returns failure', async () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      process.env.IMGBB_API_KEY = 'test-api-key';

      const mockResponse = {
        data: {
          success: false,
          error: {
            message: 'Invalid API key',
          },
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      await expect(service.uploadImage(mockFilePath)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.uploadImage(mockFilePath)).rejects.toThrow(
        'Failed to upload image to ImgBB',
      );

      process.env.IMGBB_API_KEY = originalEnv;
    });

    it('should handle network errors', async () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      process.env.IMGBB_API_KEY = 'test-api-key';

      const networkError = new Error('Network Error');
      (networkError as any).code = 'ENOTFOUND';
      (axios.post as jest.Mock).mockRejectedValue(networkError);

      await expect(service.uploadImage(mockFilePath)).rejects.toThrow(
        BadRequestException,
      );

      process.env.IMGBB_API_KEY = originalEnv;
    });

    it('should handle timeout errors', async () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      process.env.IMGBB_API_KEY = 'test-api-key';

      const timeoutError = new Error('Timeout');
      (timeoutError as any).code = 'ECONNABORTED';
      (axios.post as jest.Mock).mockRejectedValue(timeoutError);

      await expect(service.uploadImage(mockFilePath)).rejects.toThrow(
        BadRequestException,
      );

      process.env.IMGBB_API_KEY = originalEnv;
    });

    it('should handle HTTP response errors', async () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      process.env.IMGBB_API_KEY = 'test-api-key';

      const httpError = new Error('HTTP Error');
      (httpError as any).response = {
        status: 400,
        data: { error: 'Bad Request' },
      };
      (axios.post as jest.Mock).mockRejectedValue(httpError);

      await expect(service.uploadImage(mockFilePath)).rejects.toThrow(
        BadRequestException,
      );

      process.env.IMGBB_API_KEY = originalEnv;
    });

    it('should use auto-generated filename when custom name is not provided', async () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      process.env.IMGBB_API_KEY = 'test-api-key';

      const mockResponse = {
        data: {
          success: true,
          data: {
            url: 'https://i.ibb.co/test/image.jpg',
            delete_url: 'https://ibb.co/delete/test',
            title: 'uploaded-image',
            size: 1024,
          },
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.uploadImage(mockFilePath);

      expect(result.fileName).toBe('uploaded-image');

      process.env.IMGBB_API_KEY = originalEnv;
    });
  });

  describe('isConfigured', () => {
    it('should return true when API key is configured', () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      process.env.IMGBB_API_KEY = 'test-api-key';

      const newService = new ImgBBService(configService);
      expect(newService.isConfigured()).toBe(true);

      process.env.IMGBB_API_KEY = originalEnv;
    });

    it('should return false when API key is not configured', () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      delete process.env.IMGBB_API_KEY;

      const newService = new ImgBBService(configService);
      expect(newService.isConfigured()).toBe(false);

      process.env.IMGBB_API_KEY = originalEnv;
    });

    it('should return false when API key is default placeholder', () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      process.env.IMGBB_API_KEY = 'your-imgbb-api-key-here';

      const newService = new ImgBBService(configService);
      expect(newService.isConfigured()).toBe(false);

      process.env.IMGBB_API_KEY = originalEnv;
    });
  });

  describe('getStatus', () => {
    it('should return status information', () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      process.env.IMGBB_API_KEY = 'test-api-key';

      const newService = new ImgBBService(configService);
      const status = newService.getStatus();

      expect(status).toEqual({
        configured: true,
        apiKey: 'test-api-key',
        endpoint: 'https://api.imgbb.com/1/upload',
      });

      process.env.IMGBB_API_KEY = originalEnv;
    });

    it('should return unconfigured status when API key is not set', () => {
      const originalEnv = process.env.IMGBB_API_KEY;
      delete process.env.IMGBB_API_KEY;

      const newService = new ImgBBService(configService);
      const status = newService.getStatus();

      expect(status.configured).toBe(false);

      process.env.IMGBB_API_KEY = originalEnv;
    });
  });
});
