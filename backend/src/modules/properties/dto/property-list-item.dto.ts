import { ApiProperty } from '@nestjs/swagger';

export class PropertyListItemDto {
  @ApiProperty({ description: 'ID объекта' })
  id: string;

  @ApiProperty({ description: 'Название' })
  title: string;

  @ApiProperty({ description: 'Адрес' })
  address: string;

  @ApiProperty({ description: 'ID собственника' })
  ownerId: string;

  @ApiProperty({ description: 'Имя собственника' })
  ownerName: string;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;
}
