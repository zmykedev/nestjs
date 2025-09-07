import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import { QueryBookDto } from './query-book.dto';

export class SearchBooksDto {
  @ApiProperty({
    description: 'Query parameters for filtering, sorting and pagination',
    type: QueryBookDto,
  })
  @IsObject()
  query: QueryBookDto;
}
