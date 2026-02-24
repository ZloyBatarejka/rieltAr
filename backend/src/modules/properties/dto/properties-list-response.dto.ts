import { ApiProperty } from '@nestjs/swagger';
import { PropertyListItemDto } from './property-list-item.dto';

export class PropertiesListResponseDto {
  @ApiProperty({ type: [PropertyListItemDto], description: 'Список объектов' })
  items: PropertyListItemDto[];

  @ApiProperty({ description: 'Всего записей' })
  total: number;

  @ApiProperty({ description: 'Номер страницы' })
  page: number;

  @ApiProperty({ description: 'Количество на странице' })
  limit: number;
}
