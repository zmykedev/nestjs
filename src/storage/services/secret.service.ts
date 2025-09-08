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
      this.logger.error('🚨 SECRET MANAGER ERROR 🚨');
      this.logger.error(`Error type: ${error.constructor?.name || 'Unknown'}`);
      this.logger.error(`Error message: ${error.message}`);
      this.logger.error(`Error code: ${error.code || 'N/A'}`);
      this.logger.error(`Error status: ${error.status || 'N/A'}`);
      this.logger.error(`Secret name attempted: projects/285102780186/secrets/GOOGLE_CREDENTIALS/versions/latest`);
      this.logger.error('Full error:', error);
      
      if (error.message?.includes('permission')) {
        this.logger.error('🔒 Permission denied accessing Secret Manager');
        this.logger.error('Check if service account has secretmanager.secretAccessor role');
      }
      
      if (error.message?.includes('not found')) {
        this.logger.error('🔍 Secret not found in Secret Manager');
        this.logger.error('Verify that GOOGLE_CREDENTIALS secret exists');
      }
      
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

    this.logger.log(`Getting credentials for environment: ${environment}`);
    this.logger.log(`Project ID from config: ${this.projectId}`);

    try {
      // ALWAYS try Secret Manager first (both dev and prod)
      this.logger.log('Attempting Secret Manager credentials...');
      
      try {
        const credentials = await this.getGoogleCredentials();
        this.logger.log('✅ Secret Manager credentials obtained successfully');
        return credentials;
      } catch (secretError) {
        this.logger.warn('❌ Secret Manager failed, trying fallback...');
        this.logger.warn(`Secret Manager error: ${secretError.message}`);
        
        // Only in development, try file fallback
        if (environment !== 'production') {
          this.logger.log('Development mode: trying local file fallback');
          try {
            const fileCredentials = await this.getGoogleCredentialsFromFile();
            this.logger.log('✅ Local file credentials obtained successfully');
            return fileCredentials;
          } catch (fileError) {
            this.logger.warn('❌ File credentials also failed');
            this.logger.warn(`File error: ${fileError.message}`);
            
            // Final fallback: use default authentication
            this.logger.log('Using default Google Cloud authentication as final fallback');
            return null;
          }
        } else {
          // In production, Secret Manager is required
          this.logger.error('🚨 Production mode: Secret Manager is required but failed');
          throw secretError;
        }
      }
      
    } catch (error) {
      this.logger.error('All credential methods failed:', error);
      throw error;
    }
  }
}
