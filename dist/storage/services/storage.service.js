"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_1 = require("@google-cloud/storage");
let StorageService = StorageService_1 = class StorageService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(StorageService_1.name);
        this.isInitialized = false;
        this.initializeStorage();
    }
    initializeStorage() {
        try {
            const projectId = this.configService.get('config.gcs.projectId');
            const bucketName = this.configService.get('config.gcs.bucketName');
            const keyFile = this.configService.get('config.gcs.keyFile');
            const credentials = this.configService.get('config.gcs.credentials');
            this.logger.log(`GCS Config - ProjectId: ${projectId ? 'SET' : 'NOT SET'}`);
            this.logger.log(`GCS Config - BucketName: ${bucketName ? 'SET' : 'NOT SET'}`);
            this.logger.log(`GCS Config - KeyFile: ${keyFile ? 'SET' : 'NOT SET'}`);
            this.logger.log(`GCS Config - Credentials: ${credentials ? 'SET' : 'NOT SET'}`);
            if (!projectId || !bucketName) {
                this.logger.warn('Google Cloud Storage not configured. File uploads will be disabled.');
                return;
            }
            const storageConfig = { projectId };
            if (credentials) {
                try {
                    this.logger.log('Attempting to parse GCP credentials JSON...');
                    const credentialsJson = JSON.parse(credentials);
                    if (credentialsJson.private_key) {
                        credentialsJson.private_key = credentialsJson.private_key.replace(/\\n/g, '\n');
                        this.logger.log('Fixed private_key newlines');
                    }
                    storageConfig.credentials = credentialsJson;
                    this.logger.log('Using GCP credentials from environment variable');
                }
                catch (parseError) {
                    this.logger.error('Failed to parse GCP credentials JSON:', parseError);
                    this.logger.error('Credentials string:', credentials.substring(0, 100) + '...');
                    throw new Error('Invalid GCP credentials format');
                }
            }
            else if (keyFile) {
                storageConfig.keyFilename = keyFile;
                this.logger.log('Using GCP key file from path');
            }
            else {
                this.logger.warn('No GCP credentials or key file provided');
                return;
            }
            this.storage = new storage_1.Storage(storageConfig);
            this.bucketName = bucketName;
            this.isInitialized = true;
            this.logger.log('Google Cloud Storage initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Google Cloud Storage:', error);
            this.isInitialized = false;
        }
    }
    async uploadFileGcp(filePath) {
        try {
            if (!this.isInitialized) {
                throw new common_1.BadRequestException('Google Cloud Storage is not configured');
            }
            const bucket = this.storage.bucket(this.bucketName);
            const result = await bucket.upload(filePath);
            this.logger.log(`File uploaded successfully: ${filePath}`);
            return result;
        }
        catch (error) {
            this.logger.error('Error uploading file to GCP:', error);
            throw new common_1.BadRequestException('Failed to upload file to GCP');
        }
    }
};
StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
exports.StorageService = StorageService;
//# sourceMappingURL=storage.service.js.map