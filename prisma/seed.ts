import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@comidafeliz.com';

  const adminExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (adminExists) {
    console.log('✅ Admin já existe.');
    return;
  }

  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email,
      password: passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Admin criado com sucesso!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });