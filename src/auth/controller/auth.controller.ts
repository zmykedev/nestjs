import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetRefreshResponse,
  LoginDto,
  PostLoginResponse,
} from '../dto/login.dto';
import { CreateUserDto } from '../../users/dto/create.user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PayloadToken } from '../models/token.model';

import { AuthService } from '../services/auth.service';
import JwtRefreshGuard from '../guards/jwt-refresh.guard';

type AuthorizedRequest = Express.Request & {
  headers: { authorization: string };
  user: PayloadToken;
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Create a new user account with standard permissions. This endpoint is public and does not require authentication.',
  })
  @ApiBody({
    type: CreateUserDto,
    description:
      'User registration data including email, password, and personal information',
  })
  @ApiResponse({
    type: PostLoginResponse,
    status: 201,
    description: 'User registered successfully and logged in',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid registration data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User with this email already exists',
  })
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate a user with email and password. Returns JWT access and refresh tokens upon successful authentication.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User credentials (email and password)',
  })
  @ApiResponse({
    type: PostLoginResponse,
    status: 200,
    description: 'Login successful - JWT tokens returned',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid login data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: PayloadToken = {
      id: user.id,
    };
    return this.authService.login(payload);
  }

  @ApiOperation({
    summary: 'User logout',
    description:
      'Logout the current user by invalidating their JWT tokens. Requires valid access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful - tokens invalidated',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logout successful' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logOut(@Request() req: { user: PayloadToken }) {
    await this.authService.logout(req.user);
  }

  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Generate a new access token using a valid refresh token. Useful for maintaining user sessions.',
  })
  @ApiResponse({
    status: 200,
    type: GetRefreshResponse,
    description: 'New access token generated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired refresh token',
  })
  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req: AuthorizedRequest) {
    return this.authService.createAccessTokenFromRefreshToken(req.user);
  }
}
