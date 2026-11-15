import { randomUUID } from 'node:crypto';
import request from 'supertest';
import {
  AdminFixture,
  bearer,
  createAdminFixture,
  createE2eContext,
  E2eContext,
  responseBody,
} from './e2e-context';

describe('UserRolesModule (e2e)', () => {
  let context: E2eContext;
  let admin: AdminFixture;
  let targetUserId: number | undefined;
  let createdUserRoleId: number | undefined;

  beforeAll(async () => {
    context = await createE2eContext();
    admin = await createAdminFixture(context.app, context.prisma);
  });

  afterAll(async () => {
    if (context && createdUserRoleId) {
      await context.prisma.userRoles.deleteMany({
        where: { id: createdUserRoleId },
      });
    }
    if (context && targetUserId) {
      await context.prisma.userRoles.deleteMany({
        where: { id_user: targetUserId },
      });
      await context.prisma.user.deleteMany({ where: { id: targetUserId } });
    }
    if (admin) await admin.cleanup();
    if (context) await context.app.close();
  });

  it('POST /user-roles cria associação entre usuário e papel', async () => {
    const suffix = randomUUID().replaceAll('-', '');
    const newUser = await request(context.app.getHttpServer())
      .post('/user')
      .send({
        name: `E2E Role User ${suffix}`,
        email: `r-${suffix}@e.test`,
        password: 'Senha-E2E-123',
      })
      .expect(201);
    targetUserId = responseBody<{ id: number }>(newUser.body).id;

    const adminRole = await context.prisma.roles.findUniqueOrThrow({
      where: { name: 'ADM' },
      select: { id: true },
    });
    const dto = { id_user: targetUserId, id_roles: adminRole.id };

    const created = await request(context.app.getHttpServer())
      .post('/user-roles')
      .set(bearer(admin.token))
      .send(dto)
      .expect(201);
    createdUserRoleId = responseBody<{ id: number }>(created.body).id;

    const found = await request(context.app.getHttpServer())
      .get(`/user-roles/${createdUserRoleId}`)
      .set(bearer(admin.token))
      .expect(200);

    expect(responseBody(found.body)).toMatchObject({
      id: createdUserRoleId,
      ...dto,
    });
  });

  it('POST /user-roles rejeita identificadores que não sejam inteiros', async () => {
    await request(context.app.getHttpServer())
      .post('/user-roles')
      .set(bearer(admin.token))
      .send({ id_user: 1.5, id_roles: 1 })
      .expect(400);
  });

  it('GET /user-roles sem token retorna não autorizado', async () => {
    await request(context.app.getHttpServer()).get('/user-roles').expect(401);
  });
});
