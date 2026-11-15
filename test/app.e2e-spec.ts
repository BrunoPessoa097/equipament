import request from 'supertest';
import { createE2eContext, E2eContext } from './e2e-context';

describe('AppModule (e2e)', () => {
  let context: E2eContext;

  beforeAll(async () => {
    context = await createE2eContext();
  });

  afterAll(async () => {
    if (context) await context.app.close();
  });

  it('GET / retorna a mensagem inicial da API', async () => {
    await request(context.app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ mensagem: 'Hello World!' });
  });
});
