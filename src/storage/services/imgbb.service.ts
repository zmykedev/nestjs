import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';

@Injectable()
export class ImgBBService {
  private readonly logger = new Logger(ImgBBService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.imgbb.com/1/upload';

  constructor(private configService: ConfigService) {
    // ImgBB API Key - you need to get this from https://api.imgbb.com/
    this.apiKey = process.env.IMGBB_API_KEY || 'your-imgbb-api-key-here';

    if (!this.apiKey || this.apiKey === 'your-imgbb-api-key-here') {
      this.logger.warn(
        '⚠️  ImgBB API Key not configured. Get one from https://api.imgbb.com/',
      );
    } else {
      this.logger.log('✅ ImgBB service initialized successfully');
    }
  }

  /**
   * Upload file to ImgBB and return public URL
   * @param filePath - Local file path to upload
   * @param customFileName - Custom name for the uploaded file (optional)
   * @returns Promise with upload result including public URL
   */
  async uploadImage(
    filePath: string,
    customFileName?: string,
  ): Promise<{
    publicUrl: string;
    deleteUrl: string;
    fileName: string;
    size: number;
  }> {
    try {
      if (!this.apiKey || this.apiKey === 'your-imgbb-api-key-here') {
        throw new BadRequestException('ImgBB API Key is not configured');
      }

      this.logger.log('🔄 Starting ImgBB upload...');
      this.logger.log(`File path: ${filePath}`);
      this.logger.log(
        `Custom file name: ${customFileName || 'auto-generated'}`,
      );

      // Read file and convert to base64
      const fileBuffer = fs.readFileSync(filePath);
      const base64Image = fileBuffer.toString('base64');

      // Prepare form data
      const formData = new FormData();
      formData.append('key', this.apiKey);
      formData.append('image', base64Image);

      if (customFileName) {
        formData.append('name', customFileName);
      }

      // Upload to ImgBB
      this.logger.log('📡 Uploading to ImgBB...');
      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000, // 30 seconds timeout
      });

      if (!response.data.success) {
        throw new Error(
          `ImgBB upload failed: ${response.data.error?.message || 'Unknown error'}`,
        );
      }

      const imageData = response.data.data;

      this.logger.log('✅ Image uploaded successfully to ImgBB');
      this.logger.log(`Public URL: ${imageData.url}`);

      return {
        publicUrl: imageData.url,
        deleteUrl: imageData.delete_url,
        fileName: imageData.title || customFileName || 'uploaded-image',
        size: imageData.size,
      };
    } catch (error) {
      this.logger.error('🚨 IMGBB UPLOAD ERROR 🚨');
      this.logger.error(`Error type: ${error.constructor?.name || 'Unknown'}`);
      this.logger.error(`Error message: ${error.message}`);

      if (error.response) {
        this.logger.error(`HTTP Status: ${error.response.status}`);
        this.logger.error(`Response data:`, error.response.data);
      }

      if (error.code === 'ENOTFOUND') {
        this.logger.error('🌐 Network error: Cannot reach ImgBB servers');
      }

      if (error.code === 'ECONNABORTED') {
        this.logger.error('⏱️  Timeout error: ImgBB upload took too long');
      }

      throw new BadRequestException(
        `Failed to upload image to ImgBB: ${error.message}`,
      );
    }
  }

  /**
   * Check if ImgBB service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.apiKey !== 'your-imgbb-api-key-here');
  }

  /**
   * Get ImgBB API status
   */
  getStatus(): {
    configured: boolean;
    apiKey: string;
    endpoint: string;
  } {
    return {
      configured: this.isConfigured(),
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'NOT_SET',
      endpoint: this.apiUrl,
    };
  }
}
