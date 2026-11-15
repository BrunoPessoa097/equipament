import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

export interface E2eContext {
  app: INestApplication;
  prisma: PrismaService;
}

export interface AdminFixture {
  id: number;
  email: string;
  password: string;
  token: string;
  cleanup: () => Promise<void>;
}

export async function createE2eContext(): Promise<E2eContext> {
  const testDatabaseUrl = process.env.DATABASE_TEST_URL;
  if (!testDatabaseUrl || process.env.DATABASE_URL !== testDatabaseUrl) {
    throw new Error(
      'E2E tests require DATABASE_URL to match DATABASE_TEST_URL.',
    );
  }

  const expectedDatabase = decodeURIComponent(
    new URL(testDatabaseUrl).pathname.slice(1),
  );

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.init();

  const prisma = app.get(PrismaService);
  const [database] = await prisma.$queryRaw<{ db_name: string }[]>`
    SELECT current_database() AS db_name
  `;

  if (database?.db_name !== expectedDatabase) {
    await app.close();
    throw new Error(
      'The E2E connection did not reach the configured test database.',
    );
  }

  return { app, prisma };
}

export async function createAdminFixture(
  app: INestApplication,
  prisma: PrismaService,
): Promise<AdminFixture> {
  const suffix = randomUUID().replaceAll('-', '');
  const password = `E2e-${suffix}`;
  let role = await prisma.roles.findUnique({ where: { name: 'ADM' } });
  const roleWasCreated = !role;

  if (!role) {
    role = await prisma.roles.create({
      data: { name: 'ADM', description: 'E2E administrator' },
    });
  }

  if (!role.active) {
    if (roleWasCreated) {
      await prisma.roles.delete({ where: { id: role.id } });
    }
    throw new Error('The ADM role must be active in the E2E database.');
  }

  const user = await prisma.user.create({
    data: {
      name: `E2E ${suffix}`,
      email: `e2e-${suffix}@example.test`,
      password: await argon2.hash(password),
    },
  });

  try {
    await prisma.userRoles.create({
      data: { id_user: user.id, id_roles: role.id },
    });

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password })
      .expect(200);

    return {
      id: user.id,
      email: user.email,
      password,
      token: login.body.access_token as string,
      cleanup: async () => {
        await prisma.userRoles.deleteMany({ where: { id_user: user.id } });
        await prisma.user.delete({ where: { id: user.id } });

        if (roleWasCreated) {
          const assignments = await prisma.userRoles.count({
            where: { id_roles: role.id },
          });
          if (assignments === 0) {
            await prisma.roles.delete({ where: { id: role.id } });
          }
        }
      },
    };
  } catch (error) {
    await prisma.userRoles.deleteMany({ where: { id_user: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    if (roleWasCreated) {
      await prisma.roles.deleteMany({ where: { id: role.id } });
    }
    throw error;
  }
}

export function bearer(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
