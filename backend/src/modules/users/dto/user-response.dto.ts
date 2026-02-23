import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'owner@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
  })
  name: string;

  @ApiProperty({
    description: 'Роль пользователя',
    enum: ['ADMIN', 'MANAGER', 'OWNER'],
    example: 'OWNER',
  })
  role: Role;

  @ApiProperty({
    description: 'ID собственника (если роль OWNER)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  ownerId: string | null;

  @ApiPropertyOptional({
    description: 'Телефон собственника',
    example: '+7 999 123-45-67',
  })
  phone?: string | null;

  @ApiProperty({
    description: 'Может создавать собственников',
    example: false,
  })
  canCreateOwners: boolean;

  @ApiProperty({
    description: 'Может создавать объекты',
    example: false,
  })
  canCreateProperties: boolean;

  @ApiProperty({
    description: 'Дата создания',
    example: '2026-02-23T12:00:00.000Z',
  })
  createdAt: Date;
}
