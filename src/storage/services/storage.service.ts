import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { SecretService } from './secret.service';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private storage: Storage;
  private bucketName: string;
  private isInitialized = false;

  constructor(
    private configService: ConfigService,
    private secretService: SecretService,
  ) {
    console.log('StorageService constructor called - starting initialization');
    void this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      const projectId = this.configService.get<string>('config.gcs.projectId');
      const bucketName = this.configService.get<string>(
        'config.gcs.bucketName',
      );

      console.log('=== GCP STORAGE INITIALIZATION ===');
      console.log('Project ID:', projectId);
      console.log('Bucket Name:', bucketName);
      console.log('Key File (fallback):', this.configService.get<string>('config.gcs.keyFile'));
      console.log('NODE_ENV:', this.configService.get<string>('config.env'));
      console.log('Raw GCS_PROJECT_ID:', process.env.GCS_PROJECT_ID);
      console.log('Raw GCS_BUCKET_NAME:', process.env.GCS_BUCKET_NAME);
      console.log('Using Secret Manager for credentials...');
      console.log('===================================');

      if (!projectId || !bucketName) {
        this.logger.warn(
          'Google Cloud Storage not configured. File uploads will be disabled.',
        );
        this.logger.warn('Missing projectId or bucketName');
        return;
      }

      // Get credentials from Secret Manager (with fallback to default)
      const credentials: any = await this.secretService.getCredentials();

      // Initialize Google Cloud Storage
      // Use the correct project ID (numeric from Google Cloud Console)
      const correctProjectId = 'strategic-arc-471303-m4';
      
      if (credentials) {
        this.storage = new Storage({
          projectId: correctProjectId,
          credentials,
        });
        this.logger.log('Using Secret Manager credentials');
      } else {
        this.storage = new Storage({
          projectId: correctProjectId,
        });
        this.logger.log('Using default Google Cloud authentication');
      }

      this.bucketName = bucketName;
      this.isInitialized = true;

      this.logger.log(
        'Google Cloud Storage initialized successfully with Secret Manager',
      );
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

  /**
   * Upload file to Google Cloud Storage and return public URL
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
    try {
      if (!this.isInitialized) {
        throw new BadRequestException('Google Cloud Storage is not configured');
      }

      const bucket = this.storage.bucket(this.bucketName);

      // Upload file with custom name
      await bucket.upload(filePath, {
        destination: customFileName,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });

      // Generate public URL (bucket is already configured as public)
      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${customFileName}`;

      this.logger.log(
        `File uploaded successfully with public URL: ${publicUrl}`,
      );

      return {
        publicUrl,
        fileName: customFileName,
        bucketName: this.bucketName,
      };
    } catch (error) {
      this.logger.error('Error uploading file to GCP with public URL:', error);
      throw new BadRequestException('Failed to upload file to GCP');
    }
  }
}