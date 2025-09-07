import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateUserDto,
  DefaultColumnsResponse,
  UpdateUserDto,
} from '../dto/create.user.dto';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('users') // put the name of the controller in swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Register a new user in the system. This endpoint is public and does not require authentication.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: DefaultColumnsResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid user data' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User with this email already exists',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieve a list of all users in the system. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    isArray: true,
    type: DefaultColumnsResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieve a specific user by their unique identifier. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: DefaultColumnsResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid ID format' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update user by ID',
    description:
      "Update an existing user's information. Only specified fields will be updated. Requires authentication.",
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: DefaultColumnsResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or ID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete user by ID (Soft Delete)',
    description:
      'Soft delete a user by marking them as inactive. The user record is preserved for audit purposes but marked as deleted. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully (soft delete)',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid ID format' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
