import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Título del libro',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @Length(2, 255)
  title: string;

  @ApiProperty({ description: 'Autor del libro', minLength: 2, maxLength: 255 })
  @IsString()
  @Length(2, 255)
  author: string;

  @ApiProperty({
    description: 'Editorial del libro',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @Length(2, 255)
  publisher: string;

  @ApiProperty({
    description: 'Precio del libro',
    minimum: 0,
    maximum: 1000000,
  })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @ApiProperty({ description: 'Disponibilidad del libro', default: true })
  @IsBoolean()
  availability: boolean;

  @ApiProperty({
    description: 'Género literario',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  genre: string;

  @ApiPropertyOptional({ description: 'URL de la imagen del libro' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Descripción del libro' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Stock disponible',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}
