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
  TransactionsService,
  type TransactionListItem,
  type TransactionsListResult,
} from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionListQueryDto } from './dto/transaction-list-query.dto';
import { TransactionListItemDto } from './dto/transaction-list-item.dto';
import { TransactionsListResponseDto } from './dto/transactions-list-response.dto';
import { Roles, CurrentUser } from '../common/decorators';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Transactions')
@ApiBearerAuth('JWT-auth')
@Controller('transactions')
@Roles(Role.ADMIN, Role.MANAGER, Role.OWNER)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Ручное добавление операции (propertyId обязателен)',
  })
  @ApiResponse({
    status: 201,
    description: 'Транзакция создана',
    type: TransactionListItemDto,
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
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionListItem> {
    return this.transactionsService.create(user, dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Список транзакций с фильтрами и пагинацией (Admin — все, Manager — только по назначенным объектам, Owner — свои)',
  })
  @ApiResponse({
    status: 200,
    description: 'Список транзакций',
    type: TransactionsListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: TransactionListQueryDto,
  ): Promise<TransactionsListResult> {
    return this.transactionsService.findAll(user, query);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить транзакцию' })
  @ApiResponse({ status: 204, description: 'Транзакция удалена' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Транзакция не найдена' })
  async remove(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.transactionsService.remove(user, id);
  }
}
