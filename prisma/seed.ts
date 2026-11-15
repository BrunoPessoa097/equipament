import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const roles = [
    {
      name: 'ADM',
      description: 'Administrador do sistema',
    },
    {
      name: 'PUBLIC',
      description: 'Usuário padrão do sistema',
    },
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: {
        name: role.name,
      },
      update: {},
      create: role,
    });
  }

  const users = [
    {
      name: process.env.SEED_PUBLIC_NAME,
      email: process.env.SEED_PUBLIC_EMAIL,
      password: process.env.SEED_PUBLIC_PASSWORD,
      role: 'PUBLIC',
    },
    {
      name: process.env.SEED_ADMIN_NAME,
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
      role: 'ADM',
    },
  ];

  for (const user of users) {
    if (!user.name || !user.email || !user.password) {
      throw new Error(
        `Defina SEED_${user.role === 'ADM' ? 'ADMIN' : 'PUBLIC'}_NAME, EMAIL e PASSWORD no ambiente.`,
      );
    }

    const role = await prisma.roles.findUniqueOrThrow({
      where: { name: user.role },
      select: { id: true },
    });
    const password = await argon2.hash(user.password);
    const seededUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password,
      },
      select: { id: true },
    });

    await prisma.userRoles.createMany({
      data: [{ id_user: seededUser.id, id_roles: role.id }],
      skipDuplicates: true,
    });
  }

  console.log('Seeds executadas com sucesso.');
}

main()
  .catch((error: unknown) => {
    console.error('Erro ao executar seeds:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
