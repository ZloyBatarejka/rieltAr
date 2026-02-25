import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PayoutListItemDto {
  @ApiProperty({ description: 'ID выплаты' })
  id: string;

  @ApiProperty({ description: 'ID собственника' })
  ownerId: string;

  @ApiProperty({ description: 'Имя собственника' })
  ownerName: string;

  @ApiProperty({ description: 'ID объекта' })
  propertyId: string;

  @ApiProperty({ description: 'Название объекта' })
  propertyTitle: string;

  @ApiProperty({ description: 'Сумма выплаты' })
  amount: number;

  @ApiPropertyOptional({ description: 'Комментарий' })
  comment: string | null;

  @ApiProperty({ description: 'Дата фактической выплаты' })
  paidAt: Date;

  @ApiProperty({ description: 'Дата создания записи' })
  createdAt: Date;
}
