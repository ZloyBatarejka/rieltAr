import { ApiProperty } from '@nestjs/swagger';
import type { Role } from '@prisma/client';

export class AuthUserDto {
  @ApiProperty({
    description: 'ID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
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

  @ApiProperty({
    description: 'Может создавать собственников (делегировано админом)',
    example: false,
  })
  canCreateOwners: boolean;

  @ApiProperty({
    description: 'Может создавать объекты (делегировано админом)',
    example: false,
  })
  canCreateProperties: boolean;
}
