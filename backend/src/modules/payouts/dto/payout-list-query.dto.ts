import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PayoutListQueryDto {
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
    description: 'Начало периода по дате выплаты (paidAt >= from)',
    example: '2026-02-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'from должен быть корректной датой' })
  from?: string;

  @ApiPropertyOptional({
    description: 'Конец периода по дате выплаты (paidAt <= to)',
    example: '2026-02-29T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'to должен быть корректной датой' })
  to?: string;
}
