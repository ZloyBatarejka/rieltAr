import { SetMetadata } from '@nestjs/common';
import type { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Декоратор для указания требуемых ролей для доступа к эндпоинту
 * @param roles - массив ролей, которые имеют доступ
 * @example
 * @Roles(Role.MANAGER)
 * @Get('users')
 * async getUsers() { ... }
 */
export const Roles = (...roles: Role[]): ReturnType<typeof SetMetadata> => {
  return SetMetadata(ROLES_KEY, roles);
};
