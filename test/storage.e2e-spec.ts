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

describe('StorageModule (e2e)', () => {
  let context: E2eContext;
  let admin: AdminFixture;
  const createdStorageIds: number[] = [];

  beforeAll(async () => {
    context = await createE2eContext();
    admin = await createAdminFixture(context.app, context.prisma);
  });

  afterAll(async () => {
    if (context) {
      await context.prisma.storageEquipUser.deleteMany({
        where: { id_storage: { in: createdStorageIds } },
      });
      await context.prisma.storage.deleteMany({
        where: { id: { in: createdStorageIds } },
      });
    }
    if (admin) await admin.cleanup();
    if (context) await context.app.close();
  });

  it('POST /storage cria local e GET /storage/:id o retorna', async () => {
    const suffix = randomUUID();
    const dto = {
      name: `E2E-${suffix}`,
      description: 'Local criado pelo teste E2E',
      full: false,
    };

    const created = await request(context.app.getHttpServer())
      .post('/storage')
      .set(bearer(admin.token))
      .send(dto)
      .expect(201);
    const storage = responseBody<{ id: number }>(created.body);
    createdStorageIds.push(storage.id);

    const found = await request(context.app.getHttpServer())
      .get(`/storage/${storage.id}`)
      .set(bearer(admin.token))
      .expect(200);

    expect(responseBody(found.body)).toMatchObject({ id: storage.id, ...dto });
  });

  it('POST /storage rejeita o tipo incorreto para full', async () => {
    await request(context.app.getHttpServer())
      .post('/storage')
      .set(bearer(admin.token))
      .send({ name: 'E2E inválido', description: 'Teste', full: 'não' })
      .expect(400);
  });

  it('GET /storage sem token retorna não autorizado', async () => {
    await request(context.app.getHttpServer()).get('/storage').expect(401);
  });
});
