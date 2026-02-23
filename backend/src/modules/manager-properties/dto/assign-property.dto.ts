import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPropertyDto {
  @ApiProperty({
    description: 'ID менеджера',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'userId должен быть UUID' })
  @IsNotEmpty({ message: 'userId обязателен' })
  userId: string;

  @ApiProperty({
    description: 'ID объекта',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'propertyId должен быть UUID' })
  @IsNotEmpty({ message: 'propertyId обязателен' })
  propertyId: string;
}
