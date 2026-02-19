import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Декоратор для пометки эндпоинта как публичного (без авторизации)
 * @example
 * @Public()
 * @Post('login')
 * async login() { ... }
 */
export const Public = (): ReturnType<typeof SetMetadata> => {
  return SetMetadata(IS_PUBLIC_KEY, true);
};
