"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSession = void 0;
function buildSession(userInfo, accessToken, refreshToken) {
    return {
        tokens: {
            accessToken,
            refreshToken,
            tokenType: 'JWT',
            expiresIn: 3600,
            issuedAt: Date.now(),
        },
        user: {
            id: userInfo.id,
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            createdAt: userInfo.createdAt,
            updatedAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
        },
        meta: {
            location: 'Santiago, Chile',
            isActive: true,
        },
    };
}
exports.buildSession = buildSession;
//# sourceMappingURL=auth.helper.js.map