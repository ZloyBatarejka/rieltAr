import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class TransactionListQueryDto {
  @ApiPropertyOptional({
    description: 'Номер страницы (1-based)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Количество на странице',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Фильтр по ID объекта',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'propertyId должен быть UUID' })
  propertyId?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по ID собственника',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ownerId должен быть UUID' })
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по типу транзакции',
    enum: TransactionType,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({
    description: 'Начало периода (createdAt >= from)',
    example: '2026-02-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'from должен быть корректной датой' })
  from?: string;

  @ApiPropertyOptional({
    description: 'Конец периода (createdAt <= to)',
    example: '2026-02-29T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'to должен быть корректной датой' })
  to?: string;
}
