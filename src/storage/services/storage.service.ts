import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ImgBBService } from './imgbb.service';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private imgbbService: ImgBBService) {
    this.logger.log('✅ StorageService initialized with ImgBB');
    this.logger.log(`ImgBB configured: ${this.imgbbService.isConfigured()}`);
  }

  /**
   * Upload file using ImgBB
   * @param filePath - Local file path to upload
   * @param customFileName - Custom name for the uploaded file
   * @returns Promise with upload result including public URL
   */
  async uploadFileAndGetPublicUrl(
    filePath: string,
    customFileName: string,
  ): Promise<{
    publicUrl: string;
    fileName: string;
    bucketName: string;
  }> {
    this.logger.log('🎯 Using ImgBB for upload');

    if (!this.imgbbService.isConfigured()) {
      throw new BadRequestException(
        'ImgBB is not configured. Please set IMGBB_API_KEY environment variable. Get your API key from: https://api.imgbb.com/',
      );
    }

    try {
      const result = await this.imgbbService.uploadImage(
        filePath,
        customFileName,
      );
      this.logger.log('✅ ImgBB upload successful');
      return {
        publicUrl: result.publicUrl,
        fileName: result.fileName,
        bucketName: 'imgbb', // Not a real bucket, just for compatibility
      };
    } catch (error) {
      this.logger.error('❌ ImgBB upload failed');
      throw error; // Re-throw the original error from ImgBB service
    }
  }
}
