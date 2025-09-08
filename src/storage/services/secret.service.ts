import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

@Injectable()
export class SecretService {
  private readonly logger = new Logger(SecretService.name);
  private client: SecretManagerServiceClient;
  private projectId: string;

  constructor(private configService: ConfigService) {
    this.projectId = this.configService.get<string>('config.gcs.projectId');
    
    // Try to initialize with credentials if available
    const keyFile = this.configService.get<string>('config.gcs.keyFile');
    try {
      if (keyFile) {
        this.client = new SecretManagerServiceClient({
          keyFilename: keyFile,
        });
        this.logger.log('SecretManagerServiceClient initialized with key file');
      } else {
        this.client = new SecretManagerServiceClient();
        this.logger.log('SecretManagerServiceClient initialized with default credentials');
      }
    } catch (error) {
      this.logger.warn('Failed to initialize SecretManagerServiceClient with key file, using default');
      this.client = new SecretManagerServiceClient();
    }
  }

  /**
   * Get Google Cloud credentials from Secret Manager
   * @returns Google Cloud service account credentials as JSON object
   */
  async getGoogleCredentials(): Promise<any> {
    try {
      if (!this.projectId) {
        throw new Error('Project ID not configured');
      }

      // The secret name in Secret Manager  
      // Use the numeric project ID from the image: 285102780186
      const numericProjectId = '285102780186';
      const secretName = `projects/${numericProjectId}/secrets/GOOGLE_CREDENTIALS/versions/latest`;

      this.logger.log(`Accessing secret: ${secretName}`);

      const [version] = await this.client.accessSecretVersion({
        name: secretName,
      });

      const payload = version.payload?.data?.toString();
      if (!payload) {
        throw new Error('No se pudo leer el secreto desde Secret Manager');
      }

      this.logger.log(
        'Successfully retrieved Google credentials from Secret Manager',
      );

      // Parse and return the JSON credentials
      return JSON.parse(payload);
    } catch (error: any) {
      this.logger.error(
        'Error accessing Google credentials from Secret Manager:',
        error,
      );
      throw new Error(`Failed to get Google credentials: ${error.message}`);
    }
  }

  /**
   * Fallback method to get credentials from local file (for development)
   * @returns Google Cloud service account credentials as JSON object
   */
  async getGoogleCredentialsFromFile(): Promise<any> {
    try {
      const keyFile = this.configService.get<string>('config.gcs.keyFile');
      if (!keyFile) {
        throw new Error('Key file path not configured');
      }

      this.logger.log(`Reading credentials from local file: ${keyFile}`);

      // Use dynamic import to read the file
      const fs = await import('fs');
      const path = await import('path');

      const filePath = path.resolve(keyFile);
      const credentialsContent = fs.readFileSync(filePath, 'utf8');

      this.logger.log('Successfully read Google credentials from local file');

      return JSON.parse(credentialsContent);
    } catch (error: any) {
      this.logger.error('Error reading Google credentials from file:', error);
      throw new Error(`Failed to read credentials file: ${error.message}`);
    }
  }

  /**
   * Get Google credentials with fallback strategy:
   * 1. Try Secret Manager first (production)
   * 2. Fall back to local file (development)
   */
  async getCredentials(): Promise<any> {
    const environment = this.configService.get<string>('config.env');

    try {
      // In production, always use Secret Manager
      if (environment === 'production') {
        return await this.getGoogleCredentials();
      }

      // In development, skip Secret Manager and use default authentication
      this.logger.log('Development mode: using default Google Cloud authentication');
      
      // Return null to let Google Cloud SDK use default authentication
      // This will work if gcloud is configured or if running on GCP
      return null;
      
    } catch (error) {
      this.logger.error('All credential methods failed:', error);
      throw error;
    }
  }
}
