import {
  Controller,
  Post,
  Get,
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
  ApiQuery,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  ManagerPropertiesService,
  type ManagerPropertyResponse,
} from './manager-properties.service';
import { AssignPropertyDto } from './dto/assign-property.dto';
import { ManagerPropertyResponseDto } from './dto/manager-property-response.dto';
import { Roles } from '../common/decorators';

@ApiTags('Manager Properties')
@ApiBearerAuth('JWT-auth')
@Controller('manager-properties')
@Roles(Role.ADMIN)
export class ManagerPropertiesController {
  constructor(
    private readonly managerPropertiesService: ManagerPropertiesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Назначить объект на менеджера' })
  @ApiResponse({
    status: 201,
    description: 'Назначение создано',
    type: ManagerPropertyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 404, description: 'Менеджер или объект не найден' })
  @ApiResponse({ status: 409, description: 'Объект уже назначен' })
  async assign(
    @Body() dto: AssignPropertyDto,
  ): Promise<ManagerPropertyResponse> {
    return this.managerPropertiesService.assign(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Снять назначение объекта' })
  @ApiResponse({ status: 204, description: 'Назначение удалено' })
  @ApiResponse({ status: 404, description: 'Назначение не найдено' })
  async unassign(@Param('id') id: string): Promise<void> {
    return this.managerPropertiesService.unassign(id);
  }

  @Get()
  @ApiOperation({ summary: 'Список назначений (фильтр по userId/propertyId)' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiResponse({
    status: 200,
    description: 'Список назначений',
    type: [ManagerPropertyResponseDto],
  })
  async findAll(
    @Query('userId') userId?: string,
    @Query('propertyId') propertyId?: string,
  ): Promise<ManagerPropertyResponse[]> {
    return this.managerPropertiesService.findAll(userId, propertyId);
  }
}
