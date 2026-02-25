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
  PayoutsService,
  type PayoutListItem,
  type PayoutsListResult,
} from './payouts.service';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { PayoutListQueryDto } from './dto/payout-list-query.dto';
import { PayoutListItemDto } from './dto/payout-list-item.dto';
import { PayoutsListResponseDto } from './dto/payouts-list-response.dto';
import { Roles, CurrentUser } from '../common/decorators';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Payouts')
@ApiBearerAuth('JWT-auth')
@Controller('payouts')
@Roles(Role.ADMIN, Role.MANAGER, Role.OWNER)
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary:
      'Создать выплату (Admin, Manager). Автоматически создаёт транзакцию PAYOUT',
  })
  @ApiResponse({
    status: 201,
    description: 'Выплата создана',
    type: PayoutListItemDto,
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
    @Body() dto: CreatePayoutDto,
  ): Promise<PayoutListItem> {
    return this.payoutsService.create(user, dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Список выплат с пагинацией и фильтрами (Admin — все, Manager — только по назначенным объектам, Owner — свои)',
  })
  @ApiResponse({
    status: 200,
    description: 'Список выплат',
    type: PayoutsListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: PayoutListQueryDto,
  ): Promise<PayoutsListResult> {
    return this.payoutsService.findAll(user, query);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить выплату' })
  @ApiResponse({ status: 204, description: 'Выплата удалена' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Выплата не найдена' })
  async remove(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.payoutsService.remove(user, id);
  }
}
