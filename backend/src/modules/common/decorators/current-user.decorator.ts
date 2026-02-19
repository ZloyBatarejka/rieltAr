import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '../../auth/auth.types';

/**
 * Декоратор для извлечения текущего пользователя из запроса
 * Используется в контроллерах для получения данных авторизованного пользователя
 * @example
 * @Get('me')
 * async getMe(@CurrentUser() user: AuthUser) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    return request.user;
  },
);
