import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OwnersListQueryDto {
  @ApiPropertyOptional({
    description: 'Поиск по имени собственника',
    example: 'Иван',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
