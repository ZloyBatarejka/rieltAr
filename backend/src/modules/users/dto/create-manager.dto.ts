import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateManagerDto {
  @ApiProperty({
    description: 'Email менеджера',
    example: 'manager@example.com',
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
    description: 'Имя менеджера',
    example: 'Петр Петров',
  })
  @IsString()
  @IsNotEmpty({ message: 'Имя обязательно' })
  name: string;

  @ApiPropertyOptional({
    description: 'Может создавать собственников',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'canCreateOwners должен быть boolean' })
  canCreateOwners?: boolean;

  @ApiPropertyOptional({
    description: 'Может создавать объекты',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'canCreateProperties должен быть boolean' })
  canCreateProperties?: boolean;
}
