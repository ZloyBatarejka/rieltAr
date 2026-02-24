import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class TransactionListItemDto {
  @ApiProperty({ description: 'ID транзакции' })
  id: string;

  @ApiProperty({ enum: TransactionType, description: 'Тип транзакции' })
  type: TransactionType;

  @ApiProperty({ description: 'Сумма' })
  amount: number;

  @ApiPropertyOptional({ description: 'Комментарий' })
  comment: string | null;

  @ApiProperty({ description: 'ID объекта' })
  propertyId: string;

  @ApiProperty({ description: 'Название объекта' })
  propertyTitle: string;

  @ApiProperty({ description: 'ID собственника' })
  ownerId: string;

  @ApiProperty({ description: 'Имя собственника' })
  ownerName: string;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;
}
