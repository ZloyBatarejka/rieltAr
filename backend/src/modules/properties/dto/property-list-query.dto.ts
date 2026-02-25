import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PropertyListQueryDto {
  @ApiPropertyOptional({
    description: 'Фильтр по ID собственника',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ownerId должен быть UUID' })
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Поиск по названию или адресу',
    example: 'Тверская',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
