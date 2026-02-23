import { ApiProperty } from '@nestjs/swagger';
import { OwnerListItemDto } from './owner-list-item.dto';

export class OwnersListResponseDto {
  @ApiProperty({
    type: [OwnerListItemDto],
    description: 'Список собственников',
  })
  items: OwnerListItemDto[];

  @ApiProperty({ description: 'Всего записей' })
  total: number;

  @ApiProperty({ description: 'Номер страницы' })
  page: number;

  @ApiProperty({ description: 'Количество на странице' })
  limit: number;
}
