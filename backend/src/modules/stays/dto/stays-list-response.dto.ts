import { ApiProperty } from '@nestjs/swagger';
import { StayListItemDto } from './stay-list-item.dto';

export class StaysListResponseDto {
  @ApiProperty({
    type: [StayListItemDto],
    description: 'Список заездов',
  })
  items: StayListItemDto[];

  @ApiProperty({ description: 'Всего записей' })
  total: number;
}
