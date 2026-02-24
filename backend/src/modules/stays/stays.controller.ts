import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  StaysService,
  type StayDetail,
  type StaysListResult,
} from './stays.service';
import { CreateStayDto } from './dto/create-stay.dto';
import { StayListQueryDto } from './dto/stay-list-query.dto';
import { StayDetailDto } from './dto/stay-detail.dto';
import { StaysListResponseDto } from './dto/stays-list-response.dto';
import { Roles, CurrentUser } from '../common/decorators';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Stays')
@ApiBearerAuth('JWT-auth')
@Controller('stays')
@Roles(Role.ADMIN, Role.MANAGER, Role.OWNER)
export class StaysController {
  constructor(private readonly staysService: StaysService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary:
      'Создать заезд (Admin, Manager). Автоматически создаёт связанные транзакции',
  })
  @ApiResponse({
    status: 201,
    description: 'Заезд создан',
    type: StayDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({
    status: 404,
    description: 'Объект не найден или нет доступа',
  })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateStayDto,
  ): Promise<StayDetail> {
    return this.staysService.create(user, dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Список заездов с фильтрами (propertyId, ownerId, даты, имя гостя)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Список заездов с пагинацией. Admin — все, Manager — только назначенные объекты, Owner — только свои',
    type: StaysListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: StayListQueryDto,
  ): Promise<StaysListResult> {
    return this.staysService.findAll(user, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Детали заезда с вложенными транзакциями',
  })
  @ApiResponse({
    status: 200,
    description: 'Данные заезда с транзакциями',
    type: StayDetailDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Заезд не найден' })
  async findOne(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<StayDetail> {
    return this.staysService.findOne(user, id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Удалить заезд (Admin, Manager). Удаляет связанные транзакции',
  })
  @ApiResponse({ status: 204, description: 'Заезд удалён' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Заезд не найден' })
  async remove(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.staysService.remove(user, id);
  }
}
