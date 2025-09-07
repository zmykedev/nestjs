declare const _default: (() => {
    port: number;
    db: {
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
    };
    devtools: {
        enabled: boolean;
        port: number;
    };
    env: string;
    cors: string;
    jwt: {
        jwtSecret: string;
        jwtRefreshSecret: string;
        refreshTokenExpiration: string;
        accessTokenExpiration: string;
    };
    gcs: {
        projectId: string;
        bucketName: string;
        keyFile: string;
        credentials: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    db: {
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
    };
    devtools: {
        enabled: boolean;
        port: number;
    };
    env: string;
    cors: string;
    jwt: {
        jwtSecret: string;
        jwtRefreshSecret: string;
        refreshTokenExpiration: string;
        accessTokenExpiration: string;
    };
    gcs: {
        projectId: string;
        bucketName: string;
        keyFile: string;
        credentials: string;
    };
}>;
export default _default;
