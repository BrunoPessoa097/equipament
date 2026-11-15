import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: { getAllAndOverride: jest.Mock };
  let prisma: { userRoles: { findMany: jest.Mock } };
  let context: ExecutionContext;
  let request: { user?: { userId: number; email: string } };
  const handler = jest.fn();
  const controller = jest.fn();

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    prisma = { userRoles: { findMany: jest.fn() } };
    request = {};
    context = {
      getHandler: () => handler,
      getClass: () => controller,
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    guard = new RolesGuard(
      reflector as unknown as Reflector,
      prisma as unknown as PrismaService,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('permite acesso quando a rota não exige papéis', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      handler,
      controller,
    ]);
    expect(prisma.userRoles.findMany).not.toHaveBeenCalled();
  });

  it('permite acesso quando a lista de papéis exigidos está vazia', async () => {
    reflector.getAllAndOverride.mockReturnValue([]);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(prisma.userRoles.findMany).not.toHaveBeenCalled();
  });

  it('nega acesso quando a requisição não contém usuário autenticado', async () => {
    reflector.getAllAndOverride.mockReturnValue(['ADM']);

    await expect(guard.canActivate(context)).resolves.toBe(false);
    expect(prisma.userRoles.findMany).not.toHaveBeenCalled();
  });

  it('consulta os papéis do usuário e permite acesso quando há papel exigido ativo', async () => {
    reflector.getAllAndOverride.mockReturnValue(['ADM']);
    request.user = { userId: 42, email: 'user@example.com' };
    prisma.userRoles.findMany.mockResolvedValue([
      { roles: { name: 'PUBLIC', active: true } },
      { roles: { name: 'ADM', active: true } },
    ]);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(prisma.userRoles.findMany).toHaveBeenCalledWith({
      where: { id_user: 42 },
      select: {
        roles: {
          select: { name: true, active: true },
        },
      },
    });
  });

  it('nega acesso quando o usuário não possui papel exigido', async () => {
    reflector.getAllAndOverride.mockReturnValue(['ADM']);
    request.user = { userId: 42, email: 'user@example.com' };
    prisma.userRoles.findMany.mockResolvedValue([
      { roles: { name: 'PUBLIC', active: true } },
    ]);

    await expect(guard.canActivate(context)).resolves.toBe(false);
  });

  it('nega acesso quando o papel exigido está inativo', async () => {
    reflector.getAllAndOverride.mockReturnValue(['ADM']);
    request.user = { userId: 42, email: 'user@example.com' };
    prisma.userRoles.findMany.mockResolvedValue([
      { roles: { name: 'ADM', active: false } },
    ]);

    await expect(guard.canActivate(context)).resolves.toBe(false);
  });
});
