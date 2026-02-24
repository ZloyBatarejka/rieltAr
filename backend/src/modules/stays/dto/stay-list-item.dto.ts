import { ApiProperty } from '@nestjs/swagger';

export class StayListItemDto {
  @ApiProperty({ description: 'ID заезда' })
  id: string;

  @ApiProperty({ description: 'ID объекта' })
  propertyId: string;

  @ApiProperty({ description: 'Название объекта' })
  propertyTitle: string;

  @ApiProperty({ description: 'ID собственника' })
  ownerId: string;

  @ApiProperty({ description: 'Имя собственника' })
  ownerName: string;

  @ApiProperty({ description: 'Имя гостя' })
  guestName: string;

  @ApiProperty({ description: 'Дата заезда' })
  checkIn: Date;

  @ApiProperty({ description: 'Дата выезда' })
  checkOut: Date;

  @ApiProperty({ description: 'Сумма заезда' })
  totalAmount: number;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;
}
