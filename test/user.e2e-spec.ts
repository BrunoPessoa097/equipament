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

describe('UserModule (e2e)', () => {
  let context: E2eContext;
  let admin: AdminFixture;
  const createdUserIds: number[] = [];

  beforeAll(async () => {
    context = await createE2eContext();
    admin = await createAdminFixture(context.app, context.prisma);
  });

  afterAll(async () => {
    if (context) {
      await context.prisma.userRoles.deleteMany({
        where: { id_user: { in: createdUserIds } },
      });
      await context.prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }
    if (admin) await admin.cleanup();
    if (context) await context.app.close();
  });

  it('POST /user cria usuário e não retorna a senha', async () => {
    const suffix = randomUUID().replaceAll('-', '');
    const dto = {
      name: `E2E User ${suffix}`,
      email: `u-${suffix}@e.test`,
      password: 'Senha-E2E-123',
    };

    const response = await request(context.app.getHttpServer())
      .post('/user')
      .send(dto)
      .expect(201);

    const user = responseBody<{ id: number; name: string; email: string }>(
      response.body,
    );
    createdUserIds.push(user.id);
    expect(user).toMatchObject({ name: dto.name, email: dto.email });
    expect(user).not.toHaveProperty('password');
  });

  it('GET /user/:id retorna usuário autenticado sem expor a senha', async () => {
    const response = await request(context.app.getHttpServer())
      .get(`/user/${admin.id}`)
      .set(bearer(admin.token))
      .expect(200);

    const user = responseBody<{ id: number; email: string }>(response.body);
    expect(user).toMatchObject({ id: admin.id, email: admin.email });
    expect(user).not.toHaveProperty('password');
  });

  it('GET /user sem token retorna não autorizado', async () => {
    await request(context.app.getHttpServer()).get('/user').expect(401);
  });

  it('GET /user/:id rejeita identificador inválido', async () => {
    await request(context.app.getHttpServer())
      .get('/user/invalido')
      .set(bearer(admin.token))
      .expect(400);
  });
});
