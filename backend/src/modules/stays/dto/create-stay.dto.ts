import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStayDto {
  @ApiProperty({
    description: 'ID объекта, к которому относится заезд',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'propertyId должен быть UUID' })
  @IsNotEmpty({ message: 'propertyId обязателен' })
  propertyId: string;

  @ApiProperty({
    description: 'Имя гостя',
    example: 'Иван Иванов',
  })
  @IsString()
  @IsNotEmpty({ message: 'Имя гостя обязательно' })
  guestName: string;

  @ApiProperty({
    description: 'Дата заезда',
    example: '2026-02-24T15:00:00.000Z',
  })
  @IsDateString({}, { message: 'checkIn должен быть корректной датой' })
  checkIn: string;

  @ApiProperty({
    description: 'Дата выезда',
    example: '2026-02-28T11:00:00.000Z',
  })
  @IsDateString({}, { message: 'checkOut должен быть корректной датой' })
  checkOut: string;

  @ApiProperty({
    description: 'Общая сумма заезда (до комиссии и уборки)',
    example: 25000,
  })
  @IsNumber()
  @IsPositive({ message: 'totalAmount должен быть больше 0' })
  totalAmount: number;

  @ApiPropertyOptional({
    description: 'Процент комиссии менеджера (0-100)',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPercent?: number;

  @ApiPropertyOptional({
    description: 'Сумма уборки',
    example: 1500,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  cleaningAmount?: number;

  @ApiPropertyOptional({
    description: 'Комментарий к основной доходной операции',
    example: 'Бронирование через Airbnb',
  })
  @IsOptional()
  @IsString()
  incomeComment?: string;

  @ApiPropertyOptional({
    description: 'Комментарий к комиссии',
    example: 'Комиссия 15% от суммы заезда',
  })
  @IsOptional()
  @IsString()
  commissionComment?: string;

  @ApiPropertyOptional({
    description: 'Комментарий к уборке',
    example: 'Генеральная уборка после выезда гостя',
  })
  @IsOptional()
  @IsString()
  cleaningComment?: string;
}
