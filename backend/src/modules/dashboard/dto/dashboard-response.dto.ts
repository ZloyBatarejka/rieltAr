import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class DashboardTransactionDto {
  @ApiProperty({ description: 'ID транзакции' })
  id: string;

  @ApiProperty({ enum: TransactionType, description: 'Тип' })
  type: TransactionType;

  @ApiProperty({ description: 'Сумма' })
  amount: number;

  @ApiProperty({ description: 'Комментарий', nullable: true })
  comment: string | null;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;
}

export class DashboardResponseDto {
  @ApiProperty({ description: 'Общий баланс' })
  balance: number;

  @ApiProperty({ description: 'Доход за период (INCOME)' })
  income: number;

  @ApiProperty({
    description: 'Расходы за период (COMMISSION + CLEANING + EXPENSE)',
  })
  expenses: number;

  @ApiProperty({ description: 'Выплаты за период (PAYOUT)' })
  payouts: number;

  @ApiProperty({
    type: [DashboardTransactionDto],
    description: 'Последние 5 операций',
  })
  lastTransactions: DashboardTransactionDto[];

  @ApiProperty({ description: 'Количество объектов' })
  propertiesCount: number;

  @ApiProperty({
    description: 'Количество активных заездов (checkIn <= now <= checkOut)',
  })
  activeStaysCount: number;
}
