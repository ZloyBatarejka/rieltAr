import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({
    description: 'Название объекта',
    example: 'Квартира на Тверской',
  })
  @IsString()
  @IsNotEmpty({ message: 'Название обязательно' })
  title: string;

  @ApiProperty({
    description: 'Адрес объекта',
    example: 'ул. Тверская, д. 1',
  })
  @IsString()
  @IsNotEmpty({ message: 'Адрес обязателен' })
  address: string;

  @ApiProperty({
    description: 'ID собственника',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'ownerId должен быть UUID' })
  @IsNotEmpty({ message: 'ownerId обязателен' })
  ownerId: string;
}
