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
  @ApiOperation({ summary: 'Simple file upload to ImgBB' })
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
            publicUrl: {
              type: 'string',
              example: 'https://i.ibb.co/example/image.jpg',
            },
            fileName: { type: 'string', example: 'custom-file-name.jpg' },
            bucketName: { type: 'string', example: 'imgbb' },
          },
        },
        message: { type: 'string', example: 'File uploaded successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file path or ImgBB not configured',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadFileSimple(
    @Query('filePath') filePath: string,
    @Query('fileName') fileName?: string,
  ) {
    if (!filePath) {
      throw new BadRequestException('File path is required');
    }

    const customFileName = fileName || `upload-${Date.now()}.jpg`;
    const result = await this.storageService.uploadFileAndGetPublicUrl(
      filePath,
      customFileName,
    );

    return result;
  }
}
