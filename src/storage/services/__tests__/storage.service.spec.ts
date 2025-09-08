import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { StorageService } from '../storage.service';
import { ImgBBService } from '../imgbb.service';

describe('StorageService', () => {
  let service: StorageService;
  let imgbbService: jest.Mocked<ImgBBService>;

  beforeEach(async () => {
    const mockImgbbService = {
      isConfigured: jest.fn(),
      uploadImage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ImgBBService,
          useValue: mockImgbbService,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    imgbbService = module.get(ImgBBService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with ImgBB service', () => {
    expect(imgbbService).toBeDefined();
  });

  describe('uploadFileAndGetPublicUrl', () => {
    const mockFilePath = '/path/to/image.jpg';
    const mockFileName = 'test-image.jpg';

    it('should upload file successfully using ImgBB', async () => {
      const mockUploadResult = {
        publicUrl: 'https://i.ibb.co/test/image.jpg',
        deleteUrl: 'https://ibb.co/delete/test',
        fileName: 'test-image.jpg',
        size: 1024,
      };

      imgbbService.isConfigured.mockReturnValue(true);
      imgbbService.uploadImage.mockResolvedValue(mockUploadResult);

      const result = await service.uploadFileAndGetPublicUrl(mockFilePath, mockFileName);

      expect(imgbbService.isConfigured).toHaveBeenCalled();
      expect(imgbbService.uploadImage).toHaveBeenCalledWith(mockFilePath, mockFileName);
      expect(result).toEqual({
        publicUrl: 'https://i.ibb.co/test/image.jpg',
        fileName: 'test-image.jpg',
        bucketName: 'imgbb',
      });
    });

    it('should throw error when ImgBB is not configured', async () => {
      imgbbService.isConfigured.mockReturnValue(false);

      await expect(
        service.uploadFileAndGetPublicUrl(mockFilePath, mockFileName),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.uploadFileAndGetPublicUrl(mockFilePath, mockFileName),
      ).rejects.toThrow('ImgBB is not configured');

      expect(imgbbService.uploadImage).not.toHaveBeenCalled();
    });

    it('should re-throw error from ImgBB service', async () => {
      const mockError = new BadRequestException('ImgBB upload failed');
      
      imgbbService.isConfigured.mockReturnValue(true);
      imgbbService.uploadImage.mockRejectedValue(mockError);

      await expect(
        service.uploadFileAndGetPublicUrl(mockFilePath, mockFileName),
      ).rejects.toThrow(mockError);

      expect(imgbbService.uploadImage).toHaveBeenCalledWith(mockFilePath, mockFileName);
    });

    it('should handle network errors from ImgBB', async () => {
      const networkError = new Error('Network error');
      
      imgbbService.isConfigured.mockReturnValue(true);
      imgbbService.uploadImage.mockRejectedValue(networkError);

      await expect(
        service.uploadFileAndGetPublicUrl(mockFilePath, mockFileName),
      ).rejects.toThrow(networkError);
    });

    it('should return correct bucket name for compatibility', async () => {
      const mockUploadResult = {
        publicUrl: 'https://i.ibb.co/test/image.jpg',
        deleteUrl: 'https://ibb.co/delete/test',
        fileName: 'test-image.jpg',
        size: 1024,
      };

      imgbbService.isConfigured.mockReturnValue(true);
      imgbbService.uploadImage.mockResolvedValue(mockUploadResult);

      const result = await service.uploadFileAndGetPublicUrl(mockFilePath, mockFileName);

      expect(result.bucketName).toBe('imgbb');
    });
  });
});
