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

describe('RolesModule (e2e)', () => {
  let context: E2eContext;
  let admin: AdminFixture;
  const createdRoleIds: number[] = [];

  beforeAll(async () => {
    context = await createE2eContext();
    admin = await createAdminFixture(context.app, context.prisma);
  });

  afterAll(async () => {
    if (context) {
      await context.prisma.roles.deleteMany({
        where: { id: { in: createdRoleIds } },
      });
    }
    if (admin) await admin.cleanup();
    if (context) await context.app.close();
  });

  it('POST /roles cria papel e GET /roles/:id retorna o registro', async () => {
    const dto = {
      name: `E2E-${randomUUID()}`,
      description: 'Papel criado pelo teste E2E',
    };

    const created = await request(context.app.getHttpServer())
      .post('/roles')
      .set(bearer(admin.token))
      .send(dto)
      .expect(201);
    const role = responseBody<{ id: number }>(created.body);
    createdRoleIds.push(role.id);

    const found = await request(context.app.getHttpServer())
      .get(`/roles/${role.id}`)
      .set(bearer(admin.token))
      .expect(200);

    expect(responseBody(found.body)).toMatchObject({ id: role.id, ...dto });
  });

  it('POST /roles rejeita papel sem nome', async () => {
    await request(context.app.getHttpServer())
      .post('/roles')
      .set(bearer(admin.token))
      .send({ name: '', description: 'inválido' })
      .expect(400);
  });

  it('GET /roles sem token retorna não autorizado', async () => {
    await request(context.app.getHttpServer()).get('/roles').expect(401);
  });
});
