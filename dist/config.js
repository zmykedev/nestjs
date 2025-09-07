"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('config', () => {
    var _a, _b, _c, _d, _e, _f;
    return {
        port: Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000'),
        db: {
            host: process.env.DATABASE_HOST || 'localhost',
            port: Number((_b = process.env.DATABASE_PORT) !== null && _b !== void 0 ? _b : '5432'),
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            name: process.env.DATABASE_NAME,
        },
        devtools: {
            enabled: process.env.NODE_ENV !== 'production',
            port: 8000,
        },
        env: process.env.NODE_ENV,
        cors: process.env.CORS,
        jwt: {
            jwtSecret: (_c = process.env.JWT_SECRET) !== null && _c !== void 0 ? _c : 'defaultSecret123',
            jwtRefreshSecret: (_d = process.env.JWT_REFRESH_SECRET) !== null && _d !== void 0 ? _d : 'defaultRefreshSecret123',
            refreshTokenExpiration: (_e = process.env.REFRESH_TOKEN_EXPIRATION) !== null && _e !== void 0 ? _e : '7d',
            accessTokenExpiration: (_f = process.env.ACCESS_TOKEN_EXPIRATION) !== null && _f !== void 0 ? _f : '1h',
        },
        gcs: {
            projectId: process.env.GCS_PROJECT_ID,
            bucketName: process.env.GCS_BUCKET_NAME,
            keyFile: process.env.GCS_KEY_FILE,
            credentials: process.env.GCS_CREDENTIALS,
        },
    };
});
//# sourceMappingURL=config.js.map