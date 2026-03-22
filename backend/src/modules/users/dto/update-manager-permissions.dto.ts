import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateManagerPermissionsDto {
  @ApiPropertyOptional({
    description: 'Может создавать собственников',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'canCreateOwners должен быть boolean' })
  canCreateOwners?: boolean;

  @ApiPropertyOptional({
    description: 'Может создавать объекты',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'canCreateProperties должен быть boolean' })
  canCreateProperties?: boolean;
}
