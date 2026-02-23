import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: Role;
}

const defaultAdmin: SeedUser = {
  email: 'admin@balivi.ru',
  password: 'admin123',
  name: 'Администратор',
  role: Role.ADMIN,
};

async function main(): Promise<void> {
  console.log('🌱 Запуск seed...');

  if (process.env.NODE_ENV === 'production') {
    console.log('⛔ Seed запрещён в production');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(defaultAdmin.password, SALT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: defaultAdmin.email },
    update: { role: Role.ADMIN },
    create: {
      email: defaultAdmin.email,
      password: hashedPassword,
      name: defaultAdmin.name,
      role: defaultAdmin.role,
    },
  });

  console.log(
    `✅ Админ создан: ${user.email} (id: ${user.id}, role: ${user.role})`,
  );
}

main()
  .catch((e: unknown) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
