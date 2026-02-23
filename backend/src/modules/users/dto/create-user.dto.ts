import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email собственника',
    example: 'owner@example.com',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @ApiProperty({
    description: 'Пароль (минимум 6 символов)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

  @ApiProperty({
    description: 'Имя собственника',
    example: 'Иван Иванов',
  })
  @IsString()
  @IsNotEmpty({ message: 'Имя обязательно' })
  name: string;

  @ApiPropertyOptional({
    description: 'Телефон собственника',
    example: '+7 999 123-45-67',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
