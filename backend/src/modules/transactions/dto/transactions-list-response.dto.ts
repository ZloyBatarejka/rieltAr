import { ApiProperty } from '@nestjs/swagger';
import { TransactionListItemDto } from './transaction-list-item.dto';

export class TransactionsListResponseDto {
  @ApiProperty({
    type: [TransactionListItemDto],
    description: 'Список транзакций',
  })
  items: TransactionListItemDto[];

  @ApiProperty({ description: 'Всего записей' })
  total: number;
}
