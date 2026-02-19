import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    description: 'Сообщение',
    example: 'Выход выполнен успешно',
  })
  message: string;
}
