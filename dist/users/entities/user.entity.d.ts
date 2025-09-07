import { DefaultEntity } from '../../utils/entities/default.entity';
export declare class User extends DefaultEntity {
    email: string;
    password: string;
    refreshToken: string;
    firstName: string;
    lastName: string;
    hashPassword(): Promise<void>;
}
