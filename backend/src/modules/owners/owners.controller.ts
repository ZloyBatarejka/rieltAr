import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
import {
  OwnersService,
  type OwnerDetail,
  type OwnersListResult,
} from './owners.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { OwnerDetailDto } from './dto/owner-detail.dto';
import { OwnersListResponseDto } from './dto/owners-list-response.dto';
import { Roles } from '../common/decorators';
import { CurrentUser } from '../common/decorators';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Owners')
@ApiBearerAuth('JWT-auth')
@Controller('owners')
@Roles(Role.ADMIN, Role.MANAGER, Role.OWNER)
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Список собственников (Admin — все, Manager — доступные)',
  })
  @ApiResponse({
    status: 200,
    description: 'Список с пагинацией',
    type: OwnersListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: PaginationQueryDto,
  ): Promise<OwnersListResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.ownersService.findAll(user, page, limit, query.search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Карточка собственника с балансом' })
  @ApiResponse({
    status: 200,
    description: 'Данные собственника',
    type: OwnerDetailDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Собственник не найден' })
  async findOne(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<OwnerDetail> {
    return this.ownersService.findOne(user, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные собственника' })
  @ApiResponse({
    status: 200,
    description: 'Собственник обновлён',
    type: OwnerDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Собственник не найден' })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateOwnerDto,
  ): Promise<OwnerDetail> {
    return this.ownersService.update(user, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить собственника (Admin, Manager)' })
  @ApiResponse({ status: 204, description: 'Собственник удалён' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Собственник не найден' })
  async remove(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.ownersService.remove(user, id);
  }
}
