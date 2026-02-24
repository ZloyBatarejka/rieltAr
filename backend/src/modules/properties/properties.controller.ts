import {
  Controller,
  Get,
  Post,
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
  PropertiesService,
  type PropertyDetail,
  type PropertiesListResult,
} from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyListQueryDto } from './dto/property-list-query.dto';
import { PropertyDetailDto } from './dto/property-detail.dto';
import { PropertiesListResponseDto } from './dto/properties-list-response.dto';
import { Roles } from '../common/decorators';
import { CurrentUser } from '../common/decorators';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Properties')
@ApiBearerAuth('JWT-auth')
@Controller('properties')
@Roles(Role.ADMIN, Role.MANAGER, Role.OWNER)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Создать объект (только Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Объект создан',
    type: PropertyDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Собственник не найден' })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreatePropertyDto,
  ): Promise<PropertyDetail> {
    return this.propertiesService.create(user, dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Список объектов (Admin — все, Manager — назначенные, Owner — свои)',
  })
  @ApiResponse({
    status: 200,
    description: 'Список с пагинацией',
    type: PropertiesListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: PropertyListQueryDto,
  ): Promise<PropertiesListResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.propertiesService.findAll(
      user,
      page,
      limit,
      query.ownerId,
      query.search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Карточка объекта' })
  @ApiResponse({
    status: 200,
    description: 'Данные объекта',
    type: PropertyDetailDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Объект не найден' })
  async findOne(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<PropertyDetail> {
    return this.propertiesService.findOne(user, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Обновить объект (только Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Объект обновлён',
    type: PropertyDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Объект не найден' })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
  ): Promise<PropertyDetail> {
    return this.propertiesService.update(user, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить объект (только Admin)' })
  @ApiResponse({ status: 204, description: 'Объект удалён' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Объект не найден' })
  async remove(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.propertiesService.remove(user, id);
  }
}
