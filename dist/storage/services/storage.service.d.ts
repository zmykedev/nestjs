import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private configService;
    private readonly logger;
    private storage;
    private bucketName;
    private isInitialized;
    constructor(configService: ConfigService);
    private initializeStorage;
    uploadFileGcp(filePath: string): Promise<any>;
}
