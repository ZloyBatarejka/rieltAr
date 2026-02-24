import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID объекта (обязателен для ручной операции)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'propertyId должен быть UUID' })
  @IsNotEmpty({ message: 'propertyId обязателен' })
  propertyId: string;

  @ApiProperty({
    description: 'Тип операции',
    enum: TransactionType,
    example: 'EXPENSE',
  })
  @IsEnum(TransactionType, { message: 'Недопустимый тип транзакции' })
  type: TransactionType;

  @ApiProperty({
    description: 'Сумма (положительное число)',
    example: 1500,
  })
  @IsNumber()
  @IsPositive({ message: 'Сумма должна быть больше 0' })
  amount: number;

  @ApiPropertyOptional({
    description: 'Комментарий к операции',
    example: 'Замена смесителя',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
