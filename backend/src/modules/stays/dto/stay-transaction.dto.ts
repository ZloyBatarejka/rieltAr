import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class StayTransactionDto {
  @ApiProperty({ description: 'ID транзакции' })
  id: string;

  @ApiProperty({ enum: TransactionType, description: 'Тип транзакции' })
  type: TransactionType;

  @ApiProperty({ description: 'Сумма транзакции' })
  amount: number;

  @ApiPropertyOptional({ description: 'Комментарий' })
  comment: string | null;

  @ApiProperty({ description: 'Дата создания транзакции' })
  createdAt: Date;
}
