import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOwnerDto {
  @ApiPropertyOptional({
    description: 'Телефон собственника',
    example: '+7 999 123-45-67',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
