import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface AuthenticatedUser {
  userId: number;
  email: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();

    const user = request.user;

    if (!user) {
      return false;
    }

    const userRoles = await this.prisma.userRoles.findMany({
      where: { id_user: user.userId },
      select: {
        roles: {
          select: {
            name: true,
            active: true,
          },
        },
      },
    });

    return userRoles.some(
      ({ roles }) => roles.active && requiredRoles.includes(roles.name),
    );
  }
}
