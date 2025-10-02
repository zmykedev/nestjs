import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class GenerateFromBase64Dto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: 'Prompt must be less than 1000 characters' })
  prompt: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50 * 1024 * 1024, { message: 'Base64 image is too large (max 50MB)' })
  base64Image: string;
}
