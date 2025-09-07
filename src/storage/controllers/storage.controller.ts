import {
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { StorageService } from '../services/storage.service';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

@ApiTags('Storage')
@Controller('api/v1/storage')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-simple')
  @ApiOperation({ summary: 'Simple file upload to Google Cloud Storage' })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            result: { type: 'object', description: 'Upload result from GCS' },
            filePath: { type: 'string', example: 'D:\\temp\\nest.jpg' },
          },
        },
        message: { type: 'string', example: 'File uploaded successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid file path' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadFileGcp(@Query('filePath') filePath: string) {
    if (!filePath) {
      throw new BadRequestException('File path is required');
    }

    const result = await this.storageService.uploadFileGcp(filePath);
    return {
      result,
      filePath,
    };
  }
}
