import request from 'supertest';
import {
  createAdminFixture,
  createE2eContext,
  E2eContext,
  AdminFixture,
  responseBody,
} from './e2e-context';

describe('AuthModule (e2e)', () => {
  let context: E2eContext;
  let admin: AdminFixture;

  beforeAll(async () => {
    context = await createE2eContext();
    admin = await createAdminFixture(context.app, context.prisma);
  });

  afterAll(async () => {
    if (admin) await admin.cleanup();
    if (context) await context.app.close();
  });

  it('POST /auth/login autentica usuário ativo e retorna token', async () => {
    const response = await request(context.app.getHttpServer())
      .post('/auth/login')
      .send({ email: admin.email, password: admin.password })
      .expect(200);

    const body = responseBody<{ access_token: string }>(response.body);
    expect(body.access_token).toEqual(expect.any(String));
  });

  it('POST /auth/login rejeita credenciais incorretas', async () => {
    await request(context.app.getHttpServer())
      .post('/auth/login')
      .send({ email: admin.email, password: 'senha-incorreta' })
      .expect(401);
  });

  it('POST /auth/login valida o contrato da requisição', async () => {
    await request(context.app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'email-invalido', password: '' })
      .expect(400);
  });
});
