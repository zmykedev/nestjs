// src/nano/nano.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NanoService } from './nano.service';
import { GenerateFromBase64Dto } from './dto/generate-from-base64.dto';

@Controller('nano')
export class NanoController {
  constructor(private readonly nanoService: NanoService) {}

  @Get('generate')
  async generate(@Query('prompt') prompt: string) {
    if (!prompt) {
      throw new Error('Prompt is required');
    }
    return { url: await this.nanoService.generateImage(prompt) };
  }

  @Post('generate-from-image')
  @UseInterceptors(FileInterceptor('image'))
  async generateFromImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('prompt') prompt: string,
  ) {
    if (!file) {
      throw new Error('Image file is required');
    }
    if (!prompt) {
      throw new Error('Prompt is required');
    }
    return {
      url: await this.nanoService.generateImageFromImage(file.path, prompt),
    };
  }

  @Post('generate-from-base64')
  async generateFromBase64(@Body() dto: GenerateFromBase64Dto) {
    return {
      url: await this.nanoService.generateImageFromBase64(
        dto.base64Image,
        dto.prompt,
      ),
    };
  }
}
