import {
  PrismaClient,
  Role,
  TransactionType,
  type Property,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main(): Promise<void> {
  console.log('🌱 Запуск seed...');

  if (process.env.NODE_ENV === 'production') {
    console.log('⛔ Seed запрещён в production');
    process.exit(0);
  }

  const password = await hashPassword('password123');
  const adminPassword = await hashPassword('admin123');

  // ─── Admin ──────────────────────────────────────────────

  const admin = await prisma.user.upsert({
    where: { email: 'admin@balivi.ru' },
    update: { role: Role.ADMIN },
    create: {
      email: 'admin@balivi.ru',
      password: adminPassword,
      name: 'Администратор',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Админ: ${admin.email} (${admin.id})`);

  // ─── Менеджеры ──────────────────────────────────────────

  const manager1 = await prisma.user.upsert({
    where: { email: 'manager1@balivi.ru' },
    update: {},
    create: {
      email: 'manager1@balivi.ru',
      password,
      name: 'Алексей Петров',
      role: Role.MANAGER,
      canCreateOwners: true,
      canCreateProperties: true,
    },
  });
  console.log(`✅ Менеджер 1 (все права): ${manager1.email} (${manager1.id})`);

  const manager2 = await prisma.user.upsert({
    where: { email: 'manager2@balivi.ru' },
    update: {},
    create: {
      email: 'manager2@balivi.ru',
      password,
      name: 'Мария Сидорова',
      role: Role.MANAGER,
      canCreateOwners: true,
      canCreateProperties: false,
    },
  });
  console.log(
    `✅ Менеджер 2 (canCreateOwners): ${manager2.email} (${manager2.id})`,
  );

  const manager3 = await prisma.user.upsert({
    where: { email: 'manager3@balivi.ru' },
    update: {},
    create: {
      email: 'manager3@balivi.ru',
      password,
      name: 'Дмитрий Козлов',
      role: Role.MANAGER,
      canCreateOwners: false,
      canCreateProperties: false,
    },
  });
  console.log(`✅ Менеджер 3 (без прав): ${manager3.email} (${manager3.id})`);

  // ─── Собственники ───────────────────────────────────────

  const ownerUser1 = await prisma.user.upsert({
    where: { email: 'owner1@balivi.ru' },
    update: {},
    create: {
      email: 'owner1@balivi.ru',
      password,
      name: 'Иван Иванов',
      role: Role.OWNER,
    },
  });

  const owner1 = await prisma.owner.upsert({
    where: { userId: ownerUser1.id },
    update: {},
    create: {
      userId: ownerUser1.id,
      phone: '+7 (999) 111-11-11',
    },
  });
  console.log(`✅ Собственник 1: ${ownerUser1.name} (${owner1.id})`);

  const ownerUser2 = await prisma.user.upsert({
    where: { email: 'owner2@balivi.ru' },
    update: {},
    create: {
      email: 'owner2@balivi.ru',
      password,
      name: 'Елена Смирнова',
      role: Role.OWNER,
    },
  });

  const owner2 = await prisma.owner.upsert({
    where: { userId: ownerUser2.id },
    update: {},
    create: {
      userId: ownerUser2.id,
      phone: '+7 (999) 222-22-22',
    },
  });
  console.log(`✅ Собственник 2: ${ownerUser2.name} (${owner2.id})`);

  // ─── Объекты ────────────────────────────────────────────

  const existingProps = await prisma.property.findMany({
    where: {
      ownerId: { in: [owner1.id, owner2.id] },
    },
  });

  let prop1: Property | undefined;
  let prop2: Property | undefined;
  let prop3: Property | undefined;

  if (existingProps.length > 0) {
    prop1 = existingProps.find((p) => p.title === 'Квартира на Тверской');
    prop2 = existingProps.find((p) => p.title === 'Студия на Арбате');
    prop3 = existingProps.find((p) => p.title === 'Апартаменты в Сити');
  }

  if (!prop1) {
    prop1 = await prisma.property.create({
      data: {
        title: 'Квартира на Тверской',
        address: 'г. Москва, ул. Тверская, д. 15, кв. 42',
        ownerId: owner1.id,
      },
    });
  }

  if (!prop2) {
    prop2 = await prisma.property.create({
      data: {
        title: 'Студия на Арбате',
        address: 'г. Москва, ул. Арбат, д. 24, кв. 8',
        ownerId: owner1.id,
      },
    });
  }

  if (!prop3) {
    prop3 = await prisma.property.create({
      data: {
        title: 'Апартаменты в Сити',
        address: 'г. Москва, Пресненская наб., д. 12, апт. 505',
        ownerId: owner2.id,
      },
    });
  }

  console.log(`✅ Объект 1 (собственник 1): ${prop1.title}`);
  console.log(`✅ Объект 2 (собственник 1): ${prop2.title}`);
  console.log(`✅ Объект 3 (собственник 2): ${prop3.title}`);

  // ─── Назначения объектов на менеджеров ──────────────────

  const assignments = [
    { userId: manager1.id, propertyId: prop1.id },
    { userId: manager1.id, propertyId: prop3.id },
    { userId: manager2.id, propertyId: prop2.id },
    { userId: manager3.id, propertyId: prop3.id },
  ];

  for (const a of assignments) {
    await prisma.managerProperty.upsert({
      where: {
        userId_propertyId: {
          userId: a.userId,
          propertyId: a.propertyId,
        },
      },
      update: {},
      create: a,
    });
  }
  console.log('✅ Назначения: М1→Тверская, М1→Сити, М2→Арбат, М3→Сити');

  // ─── Заезды + транзакции ────────────────────────────────

  const existingStays = await prisma.stay.count({
    where: {
      propertyId: { in: [prop1.id, prop2.id, prop3.id] },
    },
  });

  if (existingStays > 0) {
    console.log('ℹ️  Заезды и транзакции уже существуют, пропускаю');
  } else {
    // Заезд 1: Тверская, завершённый
    const stay1 = await prisma.stay.create({
      data: {
        propertyId: prop1.id,
        guestName: 'Сергей Кузнецов',
        checkIn: new Date('2026-01-10'),
        checkOut: new Date('2026-01-15'),
        totalAmount: 25000,
      },
    });

    await prisma.transaction.createMany({
      data: [
        {
          type: TransactionType.INCOME,
          amount: 25000,
          comment: 'Аренда 10–15 янв',
          stayId: stay1.id,
          ownerId: owner1.id,
          propertyId: prop1.id,
        },
        {
          type: TransactionType.COMMISSION,
          amount: 3750,
          comment: 'Комиссия Booking 15%',
          stayId: stay1.id,
          ownerId: owner1.id,
          propertyId: prop1.id,
        },
        {
          type: TransactionType.CLEANING,
          amount: 2000,
          comment: 'Уборка после выезда',
          stayId: stay1.id,
          ownerId: owner1.id,
          propertyId: prop1.id,
        },
      ],
    });
    console.log(`✅ Заезд 1 (Тверская): ${stay1.guestName}, 25 000 ₽`);

    // Заезд 2: Тверская, текущий
    const stay2 = await prisma.stay.create({
      data: {
        propertyId: prop1.id,
        guestName: 'Анна Белова',
        checkIn: new Date('2026-02-20'),
        checkOut: new Date('2026-02-27'),
        totalAmount: 35000,
      },
    });

    await prisma.transaction.createMany({
      data: [
        {
          type: TransactionType.INCOME,
          amount: 35000,
          comment: 'Аренда 20–27 фев',
          stayId: stay2.id,
          ownerId: owner1.id,
          propertyId: prop1.id,
        },
        {
          type: TransactionType.COMMISSION,
          amount: 5250,
          comment: 'Комиссия Airbnb 15%',
          stayId: stay2.id,
          ownerId: owner1.id,
          propertyId: prop1.id,
        },
        {
          type: TransactionType.CLEANING,
          amount: 2000,
          comment: 'Уборка после выезда',
          stayId: stay2.id,
          ownerId: owner1.id,
          propertyId: prop1.id,
        },
      ],
    });
    console.log(`✅ Заезд 2 (Тверская): ${stay2.guestName}, 35 000 ₽`);

    // Заезд 3: Арбат
    const stay3 = await prisma.stay.create({
      data: {
        propertyId: prop2.id,
        guestName: 'Олег Морозов',
        checkIn: new Date('2026-02-01'),
        checkOut: new Date('2026-02-05'),
        totalAmount: 18000,
      },
    });

    await prisma.transaction.createMany({
      data: [
        {
          type: TransactionType.INCOME,
          amount: 18000,
          comment: 'Аренда 1–5 фев',
          stayId: stay3.id,
          ownerId: owner1.id,
          propertyId: prop2.id,
        },
        {
          type: TransactionType.COMMISSION,
          amount: 2700,
          comment: 'Комиссия Суточно.ру 15%',
          stayId: stay3.id,
          ownerId: owner1.id,
          propertyId: prop2.id,
        },
      ],
    });
    console.log(`✅ Заезд 3 (Арбат): ${stay3.guestName}, 18 000 ₽`);

    // Заезд 4: Сити
    const stay4 = await prisma.stay.create({
      data: {
        propertyId: prop3.id,
        guestName: 'Виктория Лебедева',
        checkIn: new Date('2026-01-20'),
        checkOut: new Date('2026-01-25'),
        totalAmount: 40000,
      },
    });

    await prisma.transaction.createMany({
      data: [
        {
          type: TransactionType.INCOME,
          amount: 40000,
          comment: 'Аренда 20–25 янв',
          stayId: stay4.id,
          ownerId: owner2.id,
          propertyId: prop3.id,
        },
        {
          type: TransactionType.COMMISSION,
          amount: 6000,
          comment: 'Комиссия Booking 15%',
          stayId: stay4.id,
          ownerId: owner2.id,
          propertyId: prop3.id,
        },
        {
          type: TransactionType.CLEANING,
          amount: 3000,
          comment: 'Уборка после выезда',
          stayId: stay4.id,
          ownerId: owner2.id,
          propertyId: prop3.id,
        },
      ],
    });
    console.log(`✅ Заезд 4 (Сити): ${stay4.guestName}, 40 000 ₽`);

    // Заезд 5: Сити, текущий
    const stay5 = await prisma.stay.create({
      data: {
        propertyId: prop3.id,
        guestName: 'Максим Новиков',
        checkIn: new Date('2026-02-18'),
        checkOut: new Date('2026-02-25'),
        totalAmount: 56000,
      },
    });

    await prisma.transaction.createMany({
      data: [
        {
          type: TransactionType.INCOME,
          amount: 56000,
          comment: 'Аренда 18–25 фев',
          stayId: stay5.id,
          ownerId: owner2.id,
          propertyId: prop3.id,
        },
        {
          type: TransactionType.COMMISSION,
          amount: 8400,
          comment: 'Комиссия Airbnb 15%',
          stayId: stay5.id,
          ownerId: owner2.id,
          propertyId: prop3.id,
        },
        {
          type: TransactionType.CLEANING,
          amount: 3000,
          comment: 'Уборка после выезда',
          stayId: stay5.id,
          ownerId: owner2.id,
          propertyId: prop3.id,
        },
      ],
    });
    console.log(`✅ Заезд 5 (Сити): ${stay5.guestName}, 56 000 ₽`);

    // ─── Доп. расход и выплата ──────────────────────────────

    await prisma.transaction.create({
      data: {
        type: TransactionType.EXPENSE,
        amount: 5000,
        comment: 'Ремонт смесителя',
        ownerId: owner1.id,
        propertyId: prop1.id,
      },
    });
    console.log('✅ Расход: Ремонт смесителя (Тверская), 5 000 ₽');

    const payout1 = await prisma.payout.create({
      data: {
        ownerId: owner1.id,
        propertyId: prop1.id,
        amount: 30000,
        comment: 'Выплата за январь',
        paidAt: new Date('2026-02-01'),
      },
    });

    await prisma.transaction.create({
      data: {
        type: TransactionType.PAYOUT,
        amount: 30000,
        comment: 'Выплата за январь',
        ownerId: owner1.id,
        propertyId: prop1.id,
        payoutId: payout1.id,
      },
    });
    console.log('✅ Выплата: Иванову за январь (Тверская), 30 000 ₽');

    const payout2 = await prisma.payout.create({
      data: {
        ownerId: owner2.id,
        propertyId: prop3.id,
        amount: 20000,
        comment: 'Частичная выплата за январь',
        paidAt: new Date('2026-02-05'),
      },
    });

    await prisma.transaction.create({
      data: {
        type: TransactionType.PAYOUT,
        amount: 20000,
        comment: 'Частичная выплата за январь',
        ownerId: owner2.id,
        propertyId: prop3.id,
        payoutId: payout2.id,
      },
    });
    console.log('✅ Выплата: Смирновой за январь (Сити), 20 000 ₽');
  }

  // ─── Итог ───────────────────────────────────────────────

  console.log('\n📊 Итоговые балансы:');

  const owner1Balance = await calculateBalance(owner1.id);
  const owner2Balance = await calculateBalance(owner2.id);

  console.log(`   Иванов:   ${owner1Balance} ₽`);
  console.log(`   Смирнова: ${owner2Balance} ₽`);
  console.log('\n✅ Seed завершён');
}

async function calculateBalance(ownerId: string): Promise<number> {
  const transactions = await prisma.transaction.findMany({
    where: { ownerId },
  });

  let balance = 0;
  for (const t of transactions) {
    const amount = Number(t.amount);
    if (t.type === TransactionType.INCOME) {
      balance += amount;
    } else {
      balance -= amount;
    }
  }
  return balance;
}

main()
  .catch((e: unknown) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
