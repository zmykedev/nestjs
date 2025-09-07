import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private storage: Storage;
  private bucketName: string;
  private isInitialized = false;

  constructor(private configService: ConfigService) {
    this.initializeStorage();
  }

  private initializeStorage() {
    try {
      const projectId = this.configService.get<string>('config.gcs.projectId');
      const bucketName = this.configService.get<string>(
        'config.gcs.bucketName',
      );
      const keyFile = this.configService.get<string>('config.gcs.keyFile');

      if (!projectId || !bucketName) {
        this.logger.warn(
          'Google Cloud Storage not configured. File uploads will be disabled.',
        );
        return;
      }

      // Initialize Google Cloud Storage
      this.storage = new Storage({
        projectId,
        keyFilename: keyFile,
      });

      this.bucketName = bucketName;
      this.isInitialized = true;

      this.logger.log('Google Cloud Storage initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Google Cloud Storage:', error);

      this.isInitialized = false;
    }
  }

  /**
   * Simple file upload to Google Cloud Storage (similar to the example)
   * @param filePath - Local file path to upload
   * @returns Promise with upload result
   */
  async uploadFileGcp(filePath: string): Promise<any> {
    try {
      if (!this.isInitialized) {
        throw new BadRequestException('Google Cloud Storage is not configured');
      }

      const bucket = this.storage.bucket(this.bucketName);
      const result = await bucket.upload(filePath);

      this.logger.log(`File uploaded successfully: ${filePath}`);
      return result;
    } catch (error) {
      this.logger.error('Error uploading file to GCP:', error);
      throw new BadRequestException('Failed to upload file to GCP');
    }
  }
}
