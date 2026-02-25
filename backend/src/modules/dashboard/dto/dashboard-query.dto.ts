import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum DashboardPeriod {
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  ALL = 'all',
}

export class DashboardQueryDto {
  @ApiPropertyOptional({
    description: 'Предустановленный период (month / quarter / year / all)',
    enum: DashboardPeriod,
    default: DashboardPeriod.ALL,
  })
  @IsOptional()
  @IsEnum(DashboardPeriod, {
    message: 'period должен быть: month, quarter, year или all',
  })
  period?: DashboardPeriod = DashboardPeriod.ALL;

  @ApiPropertyOptional({
    description:
      'Начало произвольного периода (createdAt >= from). Приоритет над period',
    example: '2026-02-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'from должен быть корректной датой (ISO 8601)' })
  from?: string;

  @ApiPropertyOptional({
    description:
      'Конец произвольного периода (createdAt <= to). Приоритет над period',
    example: '2026-02-28T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'to должен быть корректной датой (ISO 8601)' })
  to?: string;
}
