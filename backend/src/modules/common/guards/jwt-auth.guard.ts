import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators';

/**
 * JWT Auth Guard с поддержкой публичных эндпоинтов
 * Проверяет JWT токен, но пропускает эндпоинты, помеченные декоратором @Public()
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | import('rxjs').Observable<boolean> {
    // Проверяем, помечен ли эндпоинт как публичный
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser,
    info: Error | string | undefined,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Необходима авторизация');
    }

    if (info) {
      throw new UnauthorizedException(
        typeof info === 'string' ? info : 'Неверный токен',
      );
    }

    return user;
  }
}
