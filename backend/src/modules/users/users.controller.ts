import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService, type UserResponse } from './users.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from '../common/decorators';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('owner')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Создать собственника (только админ)' })
  @ApiResponse({
    status: 201,
    description: 'Собственник создан',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 409, description: 'Email уже существует' })
  async createOwner(@Body() dto: CreateOwnerDto): Promise<UserResponse> {
    return this.usersService.createOwner(dto);
  }

  @Post('manager')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Создать менеджера (только админ)' })
  @ApiResponse({
    status: 201,
    description: 'Менеджер создан',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 409, description: 'Email уже существует' })
  async createManager(@Body() dto: CreateManagerDto): Promise<UserResponse> {
    return this.usersService.createManager(dto);
  }

  @Get('managers')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Список менеджеров (только админ)' })
  @ApiResponse({
    status: 200,
    description: 'Список менеджеров',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async getManagers(): Promise<UserResponse[]> {
    return this.usersService.getManagers();
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить менеджера (только админ)' })
  @ApiResponse({ status: 204, description: 'Менеджер удалён' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Менеджер не найден' })
  async deleteManager(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteManager(id);
  }
}
