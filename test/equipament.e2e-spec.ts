import { randomUUID } from 'node:crypto';
import request from 'supertest';
import {
  AdminFixture,
  bearer,
  createAdminFixture,
  createE2eContext,
  E2eContext,
} from './e2e-context';

describe('EquipamentModule (e2e)', () => {
  let context: E2eContext;
  let admin: AdminFixture;
  const createdEquipamentIds: number[] = [];

  beforeAll(async () => {
    context = await createE2eContext();
    admin = await createAdminFixture(context.app, context.prisma);
  });

  afterAll(async () => {
    if (context) {
      await context.prisma.storageEquipUser.deleteMany({
        where: { id_equipament: { in: createdEquipamentIds } },
      });
      await context.prisma.equipament.deleteMany({
        where: { id: { in: createdEquipamentIds } },
      });
    }
    if (admin) await admin.cleanup();
    if (context) await context.app.close();
  });

  it('POST /equipament cria equipamento e GET /equipament/:id o retorna', async () => {
    const suffix = randomUUID();
    const dto = {
      name: `E2E Camera ${suffix}`,
      code: `E2E-${suffix}`,
      description: 'Equipamento criado pelo teste E2E',
      active: true,
    };

    const created = await request(context.app.getHttpServer())
      .post('/equipament')
      .set(bearer(admin.token))
      .send(dto)
      .expect(201);
    createdEquipamentIds.push(created.body.id);

    const found = await request(context.app.getHttpServer())
      .get(`/equipament/${created.body.id}`)
      .set(bearer(admin.token))
      .expect(200);

    expect(found.body).toMatchObject({ id: created.body.id, ...dto });
  });

  it('GET /equipament/:id rejeita identificador inválido', async () => {
    await request(context.app.getHttpServer())
      .get('/equipament/invalido')
      .set(bearer(admin.token))
      .expect(400);
  });

  it('GET /equipament sem token retorna não autorizado', async () => {
    await request(context.app.getHttpServer()).get('/equipament').expect(401);
  });
});
