import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePropertyDto {
  @ApiPropertyOptional({
    description: 'Название объекта',
    example: 'Квартира на Тверской',
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Название не может быть пустым' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Адрес объекта',
    example: 'ул. Тверская, д. 1',
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Адрес не может быть пустым' })
  address?: string;

  @ApiPropertyOptional({
    description: 'ID собственника',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ownerId должен быть UUID' })
  ownerId?: string;
}
