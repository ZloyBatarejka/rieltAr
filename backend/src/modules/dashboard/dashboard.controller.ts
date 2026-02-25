import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { DashboardService, type DashboardData } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { Roles, CurrentUser } from '../common/decorators';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@Roles(Role.ADMIN, Role.MANAGER, Role.OWNER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Roles(Role.OWNER)
  @ApiOperation({
    summary:
      'Дашборд для собственника (автоопределение по JWT). Фильтрация: period (month/quarter/year/all) или from/to',
  })
  @ApiResponse({
    status: 200,
    description:
      'Финансовая сводка: баланс, доходы, расходы, выплаты, последние 5 операций',
    type: DashboardResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Собственник не найден' })
  async getForCurrentUser(
    @CurrentUser() user: AuthUser,
    @Query() query: DashboardQueryDto,
  ): Promise<DashboardData> {
    return this.dashboardService.getForCurrentUser(user, query);
  }

  @Get('owner/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary:
      'Дашборд по ID собственника. Фильтрация: period (month/quarter/year/all) или from/to',
  })
  @ApiResponse({
    status: 200,
    description: 'Финансовая сводка собственника',
    type: DashboardResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Собственник не найден' })
  async getForOwner(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query() query: DashboardQueryDto,
  ): Promise<DashboardData> {
    return this.dashboardService.getForOwner(user, id, query);
  }
}
