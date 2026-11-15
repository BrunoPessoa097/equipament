import { randomUUID } from 'node:crypto';
import request from 'supertest';
import {
  AdminFixture,
  bearer,
  createAdminFixture,
  createE2eContext,
  E2eContext,
} from './e2e-context';

describe('StorageEquipUserModule (e2e)', () => {
  let context: E2eContext;
  let admin: AdminFixture;
  let storageId: number | undefined;
  let equipamentId: number | undefined;
  let relationId: number | undefined;

  beforeAll(async () => {
    context = await createE2eContext();
    admin = await createAdminFixture(context.app, context.prisma);
    const suffix = randomUUID();
    const storage = await context.prisma.storage.create({
      data: {
        name: `E2E-REL-${suffix}`,
        description: 'Pré-requisito para teste E2E',
      },
      select: { id: true },
    });
    storageId = storage.id;

    const equipament = await context.prisma.equipament.create({
      data: {
        name: `E2E relation ${suffix}`,
        code: `E2E-REL-${suffix}`,
        description: 'Pré-requisito para teste E2E',
      },
      select: { id: true },
    });
    equipamentId = equipament.id;
  });

  afterAll(async () => {
    if (context && relationId) {
      await context.prisma.storageEquipUser.deleteMany({
        where: { id: relationId },
      });
    }
    if (context && equipamentId) {
      await context.prisma.equipament.deleteMany({
        where: { id: equipamentId },
      });
    }
    if (context && storageId) {
      await context.prisma.storage.deleteMany({ where: { id: storageId } });
    }
    if (admin) await admin.cleanup();
    if (context) await context.app.close();
  });

  it('POST /storage-equip-user cria relação e GET /:id a retorna', async () => {
    const dto = {
      id_user: admin.id,
      id_storage: storageId,
      id_equipament: equipamentId,
    };

    const created = await request(context.app.getHttpServer())
      .post('/storage-equip-user')
      .set(bearer(admin.token))
      .send(dto)
      .expect(201);
    relationId = created.body.id;

    const found = await request(context.app.getHttpServer())
      .get(`/storage-equip-user/${relationId}`)
      .set(bearer(admin.token))
      .expect(200);

    expect(found.body).toMatchObject({ id: relationId, ...dto });
  });

  it('POST /storage-equip-user rejeita identificadores inválidos', async () => {
    await request(context.app.getHttpServer())
      .post('/storage-equip-user')
      .set(bearer(admin.token))
      .send({
        id_user: 'inválido',
        id_storage: storageId,
        id_equipament: equipamentId,
      })
      .expect(400);
  });

  it('GET /storage-equip-user sem token retorna não autorizado', async () => {
    await request(context.app.getHttpServer())
      .get('/storage-equip-user')
      .expect(401);
  });
});
