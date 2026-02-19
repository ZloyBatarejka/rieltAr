import { Controller, Post, Get, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { TokenPairResponseDto } from './dto/token-pair-response.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import type { AuthUser, LoginResponse, TokenPairResponse } from './auth.types';
import { Public, CurrentUser } from '../common/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токенов' })
  @ApiResponse({
    status: 200,
    description: 'Токены обновлены',
    type: TokenPairResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверный refresh токен' })
  async refresh(@Body() dto: RefreshDto): Promise<TokenPairResponse> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({
    status: 200,
    description: 'Выход выполнен успешно',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  async logout(@CurrentUser() user: AuthUser): Promise<{ message: string }> {
    await this.authService.logout(user.id);
    return { message: 'Выход выполнен успешно' };
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Данные пользователя',
    type: AuthUserDto,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  async getMe(@CurrentUser() user: AuthUser): Promise<AuthUser> {
    return this.authService.getMe(user.id);
  }
}
