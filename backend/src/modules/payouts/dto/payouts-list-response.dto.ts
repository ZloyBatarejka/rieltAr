import { ApiProperty } from '@nestjs/swagger';
import { PayoutListItemDto } from './payout-list-item.dto';

export class PayoutsListResponseDto {
  @ApiProperty({
    type: [PayoutListItemDto],
    description: 'Список выплат',
  })
  items: PayoutListItemDto[];

  @ApiProperty({ description: 'Всего записей' })
  total: number;

  @ApiProperty({ description: 'Номер страницы' })
  page: number;

  @ApiProperty({ description: 'Количество на странице' })
  limit: number;
}
