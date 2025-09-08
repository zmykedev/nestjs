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
      console.log('Raw GCS_KEY_FILE:', process.env.GCS_KEY_FILE);
      console.log('Process ENV keys:', Object.keys(process.env).filter(key => key.includes('GCS')));
      console.log('All ENV vars starting with GCS:', JSON.stringify(
        Object.keys(process.env)
          .filter(key => key.startsWith('GCS'))
          .reduce((obj, key) => { obj[key] = process.env[key]; return obj; }, {})
      ));
      console.log('Using Secret Manager for credentials...');
      console.log('===================================');

      if (!projectId || !bucketName) {
        this.logger.error('🚨 GOOGLE CLOUD STORAGE CONFIGURATION ERROR 🚨');
        this.logger.error(`Project ID: "${projectId}" (${typeof projectId}) - ${projectId ? 'OK' : 'MISSING!'}`);
        this.logger.error(`Bucket Name: "${bucketName}" (${typeof bucketName}) - ${bucketName ? 'OK' : 'MISSING!'}`);
        this.logger.error('Google Cloud Storage not configured. File uploads will be disabled.');
        this.logger.error('Missing projectId or bucketName');
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
      this.logger.error('🚨 INITIALIZATION ERROR 🚨');
      this.logger.error(`Error type: ${error.constructor?.name || 'Unknown'}`);
      this.logger.error(`Error message: ${error.message}`);
      this.logger.error('Failed to initialize Google Cloud Storage:', error);
      this.isInitialized = false;
      
      // Set storage to null to be safe
      this.storage = null;
      this.bucketName = null;
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
      this.logger.log('🔄 Starting file upload process...');
      this.logger.log(`File path: ${filePath}`);
      this.logger.log(`Custom file name: ${customFileName}`);
      this.logger.log(`Is initialized: ${this.isInitialized}`);
      this.logger.log(`Bucket name: ${this.bucketName}`);
      
      if (!this.isInitialized) {
        this.logger.error('🚨 UPLOAD ERROR: Google Cloud Storage is not initialized');
        this.logger.error(`Initialization status: ${this.isInitialized}`);
        this.logger.error(`Storage instance: ${this.storage ? 'EXISTS' : 'NULL'}`);
        this.logger.error(`Bucket name: ${this.bucketName || 'NOT SET'}`);
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
      this.logger.error('🚨 UPLOAD ERROR DETAILS 🚨');
      this.logger.error(`Error type: ${error.constructor.name}`);
      this.logger.error(`Error message: ${error.message}`);
      this.logger.error(`Error code: ${error.code || 'N/A'}`);
      this.logger.error(`Error status: ${error.status || 'N/A'}`);
      this.logger.error(`Full error:`, error);
      
      // Check specific error types
      if (error.message?.includes('credentials')) {
        this.logger.error('🔑 CREDENTIALS ERROR: Authentication failed');
        this.logger.error('This is likely a Google Cloud authentication issue');
      }
      
      if (error.message?.includes('permission')) {
        this.logger.error('🔒 PERMISSION ERROR: Access denied');
        this.logger.error('Check if service account has proper permissions');
      }
      
      if (error.message?.includes('bucket')) {
        this.logger.error('🪣 BUCKET ERROR: Bucket access issue');
        this.logger.error(`Bucket name: ${this.bucketName}`);
      }
      
      this.logger.error('Error uploading file to GCP with public URL:', error);
      throw new BadRequestException('Failed to upload file to GCP');
    }
  }
}