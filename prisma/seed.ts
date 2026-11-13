import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

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
