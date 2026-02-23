import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OwnerListItemDto {
  @ApiProperty({ description: 'ID собственника' })
  id: string;

  @ApiProperty({ description: 'Имя' })
  name: string;

  @ApiPropertyOptional({ description: 'Телефон' })
  phone: string | null;

  @ApiProperty({ description: 'Количество объектов' })
  propertiesCount: number;

  @ApiProperty({ description: 'Текущий баланс' })
  balance: number;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;
}
