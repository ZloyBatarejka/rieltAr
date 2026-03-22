import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
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
import type { AuthUser } from '../auth/auth.types';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerPermissionsDto } from './dto/update-manager-permissions.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CurrentUser, Roles } from '../common/decorators';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('owner')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary:
      'Создать собственника (админ или менеджер с правом canCreateOwners)',
  })
  @ApiResponse({
    status: 201,
    description: 'Собственник создан',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 409, description: 'Email уже существует' })
  async createOwner(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOwnerDto,
  ): Promise<UserResponse> {
    return this.usersService.createOwner(user, dto);
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

  @Patch(':id/permissions')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Обновить права менеджера (только админ)' })
  @ApiResponse({
    status: 200,
    description: 'Права менеджера обновлены',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Менеджер не найден' })
  async updateManagerPermissions(
    @Param('id') id: string,
    @Body() dto: UpdateManagerPermissionsDto,
  ): Promise<UserResponse> {
    return this.usersService.updateManagerPermissions(id, dto);
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
