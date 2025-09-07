import { StorageService } from '../services/storage.service';
export declare class StorageController {
    private readonly storageService;
    constructor(storageService: StorageService);
    uploadFileGcp(filePath: string): Promise<{
        result: any;
        filePath: string;
    }>;
}
