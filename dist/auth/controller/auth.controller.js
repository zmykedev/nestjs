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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const login_dto_1 = require("../dto/login.dto");
const create_user_dto_1 = require("../../users/dto/create.user.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const auth_service_1 = require("../services/auth.service");
const jwt_refresh_guard_1 = require("../guards/jwt-refresh.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(createUserDto) {
        return this.authService.register(createUserDto);
    }
    async login(loginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            id: user.id,
        };
        return this.authService.login(payload);
    }
    async logOut(req) {
        await this.authService.logout(req.user);
    }
    refresh(req) {
        return this.authService.createAccessTokenFromRefreshToken(req.user);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new user',
        description: 'Create a new user account with standard permissions. This endpoint is public and does not require authentication.',
    }),
    (0, swagger_1.ApiBody)({
        type: create_user_dto_1.CreateUserDto,
        description: 'User registration data including email, password, and personal information',
    }),
    (0, swagger_1.ApiResponse)({
        type: login_dto_1.PostLoginResponse,
        status: 201,
        description: 'User registered successfully and logged in',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid registration data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - User with this email already exists',
    }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'User login',
        description: 'Authenticate a user with email and password. Returns JWT access and refresh tokens upon successful authentication.',
    }),
    (0, swagger_1.ApiBody)({
        type: login_dto_1.LoginDto,
        description: 'User credentials (email and password)',
    }),
    (0, swagger_1.ApiResponse)({
        type: login_dto_1.PostLoginResponse,
        status: 200,
        description: 'Login successful - JWT tokens returned',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid login data' }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid credentials',
    }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'User logout',
        description: 'Logout the current user by invalidating their JWT tokens. Requires valid access token.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logout successful - tokens invalidated',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Logout successful' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logOut", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh access token',
        description: 'Generate a new access token using a valid refresh token. Useful for maintaining user sessions.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: login_dto_1.GetRefreshResponse,
        description: 'New access token generated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or expired refresh token',
    }),
    (0, swagger_1.ApiBearerAuth)('refresh-token'),
    (0, common_1.UseGuards)(jwt_refresh_guard_1.default),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map