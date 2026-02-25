import { ApiProperty } from '@nestjs/swagger';

export class ManagerPropertyResponseDto {
  @ApiProperty({ description: 'ID назначения' })
  id: string;

  @ApiProperty({ description: 'ID менеджера' })
  userId: string;

  @ApiProperty({ description: 'ID объекта' })
  propertyId: string;

  @ApiProperty({ description: 'Имя менеджера' })
  userName: string;

  @ApiProperty({ description: 'Название объекта' })
  propertyTitle: string;

  @ApiProperty({ description: 'Адрес объекта' })
  propertyAddress: string;

  @ApiProperty({ description: 'Дата назначения' })
  assignedAt: Date;
}
