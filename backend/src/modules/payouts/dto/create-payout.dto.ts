import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePayoutDto {
  @ApiProperty({
    description: 'ID объекта, по которому создаётся выплата',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'propertyId должен быть UUID' })
  @IsNotEmpty({ message: 'propertyId обязателен' })
  propertyId: string;

  @ApiProperty({
    description: 'Сумма выплаты (положительное число)',
    example: 15000,
  })
  @IsNumber()
  @IsPositive({ message: 'Сумма должна быть больше 0' })
  amount: number;

  @ApiPropertyOptional({
    description: 'Дата фактической выплаты (по умолчанию — сейчас)',
    example: '2026-02-24T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'paidAt должен быть корректной датой' })
  paidAt?: string;

  @ApiPropertyOptional({
    description: 'Комментарий к выплате',
    example: 'Выплата собственнику за февраль',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
