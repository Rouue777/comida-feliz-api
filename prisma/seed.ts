import {
  PrismaClient,
  IngredientType,
  MealSize,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // =========================================================
  // LIMPAR BANCO
  // =========================================================

  await prisma.payment.deleteMany();
  await prisma.orderProduct.deleteMany();
  await prisma.mealBase.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // =========================================================
  // ADMIN
  // =========================================================

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@comidafeliz.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin criado');

  // =========================================================
  // CLIENTES
  // =========================================================

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'João Silva',
        phone: '71999990001',
        address: 'Rua das Flores, 100',
      },
    }),

    prisma.customer.create({
      data: {
        name: 'Maria Santos',
        phone: '71999990002',
        address: 'Avenida Brasil, 250',
      },
    }),

    prisma.customer.create({
      data: {
        name: 'Carlos Oliveira',
        phone: '71999990003',
        address: 'Rua Bahia, 80',
      },
    }),

    prisma.customer.create({
      data: {
        name: 'Ana Souza',
        phone: '71999990004',
        address: 'Rua Central, 450',
      },
    }),
  ]);

  console.log('✅ Clientes criados');

  // =========================================================
  // INGREDIENTES
  // =========================================================

  const chicken = await prisma.ingredient.create({
    data: {
      name: 'Frango grelhado',
      type: IngredientType.PROTEIN,
      available: true,
    },
  });

  const beef = await prisma.ingredient.create({
    data: {
      name: 'Carne acebolada',
      type: IngredientType.PROTEIN,
      available: true,
    },
  });

  const sausage = await prisma.ingredient.create({
    data: {
      name: 'Linguiça',
      type: IngredientType.PROTEIN,
      available: true,
    },
  });

  const fish = await prisma.ingredient.create({
    data: {
      name: 'Peixe frito',
      type: IngredientType.PROTEIN,
      available: false,
    },
  });

  const rice = await prisma.ingredient.create({
    data: {
      name: 'Arroz branco',
      type: IngredientType.BASE,
      available: true,
    },
  });

  const pasta = await prisma.ingredient.create({
    data: {
      name: 'Macarrão',
      type: IngredientType.BASE,
      available: true,
    },
  });

  const mashedPotato = await prisma.ingredient.create({
    data: {
      name: 'Purê de batata',
      type: IngredientType.BASE,
      available: true,
    },
  });

  const beans = await prisma.ingredient.create({
    data: {
      name: 'Feijão carioca',
      type: IngredientType.BEAN,
      available: true,
    },
  });

  const blackBeans = await prisma.ingredient.create({
    data: {
      name: 'Feijão preto',
      type: IngredientType.BEAN,
      available: true,
    },
  });

  const tropeiroBeans = await prisma.ingredient.create({
    data: {
      name: 'Feijão tropeiro',
      type: IngredientType.BEAN,
      available: true,
    },
  });

  console.log('✅ Ingredientes criados');

  // =========================================================
  // CATEGORIAS
  // =========================================================

  const drinksCategory = await prisma.category.create({
    data: {
      name: 'Bebidas',
    },
  });

  const dessertCategory = await prisma.category.create({
    data: {
      name: 'Sobremesas',
    },
  });

  const extrasCategory = await prisma.category.create({
    data: {
      name: 'Extras',
    },
  });

  // =========================================================
  // PRODUTOS
  // =========================================================

  const cocaCola = await prisma.product.create({
    data: {
      name: 'Coca-Cola lata',
      price: 6.0,
      categoryId: drinksCategory.id,
      available: true,
    },
  });

  const guarana = await prisma.product.create({
    data: {
      name: 'Guaraná lata',
      price: 5.0,
      categoryId: drinksCategory.id,
      available: true,
    },
  });

  const juice = await prisma.product.create({
    data: {
      name: 'Suco natural',
      price: 8.0,
      categoryId: drinksCategory.id,
      available: true,
    },
  });

  const pudding = await prisma.product.create({
    data: {
      name: 'Pudim',
      price: 7.0,
      categoryId: dessertCategory.id,
      available: true,
    },
  });

  const brigadeiro = await prisma.product.create({
    data: {
      name: 'Brigadeiro',
      price: 4.0,
      categoryId: dessertCategory.id,
      available: true,
    },
  });

  const farofa = await prisma.product.create({
    data: {
      name: 'Farofa',
      price: 3.0,
      categoryId: extrasCategory.id,
      available: true,
    },
  });

  const salad = await prisma.product.create({
    data: {
      name: 'Salada extra',
      price: 4.0,
      categoryId: extrasCategory.id,
      available: true,
    },
  });

  console.log('✅ Produtos criados');

  // =========================================================
  // FUNÇÃO AUXILIAR PARA CRIAR PEDIDO
  // =========================================================

  async function createOrder({
    orderNumber,
    customerId,
    type,
    status,
    size,
    protein,
    bean,
    bases,
    products = [],
    paymentMethod,
    paymentStatus,
    createdAt,
    observation,
  }: {
    orderNumber: number;
    customerId: string;
    type: OrderType;
    status: OrderStatus;
    size: MealSize;
    protein: string;
    bean: string;
    bases: string[];
    products?: {
      productId: string;
      quantity: number;
    }[];
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    observation?: string;
  }) {
    const unitPrice = size === MealSize.M ? 20 : 30;

    const mealQuantity = 1;

    const mealSubtotal = unitPrice * mealQuantity;

    const productsData = products.map((product) => {
      const productMap: Record<string, number> = {
        [cocaCola.id]: 6,
        [guarana.id]: 5,
        [juice.id]: 8,
        [pudding.id]: 7,
        [brigadeiro.id]: 4,
        [farofa.id]: 3,
        [salad.id]: 4,
      };

      const productPrice = productMap[product.productId];

      return {
        productId: product.productId,
        quantity: product.quantity,
        unitPrice: productPrice,
        subtotal: productPrice * product.quantity,
      };
    });

    const productsTotal = productsData.reduce(
      (total, product) => total + product.subtotal,
      0,
    );

    const total = mealSubtotal + productsTotal;

    return prisma.order.create({
      data: {
        orderNumber,
        customerId,
        userId: admin.id,
        type,
        status,
        total,
        createdAt,

        meals: {
          create: {
            size,
            proteinId: protein,
            beanId: bean,
            quantity: mealQuantity,
            unitPrice,
            subtotal: mealSubtotal,
            observation,

            bases: {
              create: bases.map((ingredientId) => ({
                ingredientId,
              })),
            },
          },
        },

        products: {
          create: productsData,
        },

        payment: {
          create: {
            method: paymentMethod,
            status: paymentStatus,
            amount: total,
            paidAt:
              paymentStatus === PaymentStatus.PAID
                ? createdAt
                : null,
          },
        },
      },
    });
  }

  // =========================================================
  // PEDIDOS
  // =========================================================

  const now = new Date();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const orders = [
    // ---------------------------------------------------------
    // PEDIDO 1
    // ---------------------------------------------------------

    createOrder({
      orderNumber: 1001,
      customerId: customers[0].id,
      type: OrderType.DELIVERY,
      status: OrderStatus.CONFIRMED,
      size: MealSize.M,
      protein: chicken.id,
      bean: beans.id,
      bases: [rice.id],
      products: [
        {
          productId: cocaCola.id,
          quantity: 1,
        },
      ],
      paymentMethod: PaymentMethod.PIX,
      paymentStatus: PaymentStatus.PAID,
      createdAt: now,
    }),

    // ---------------------------------------------------------
    // PEDIDO 2
    // ---------------------------------------------------------

    createOrder({
      orderNumber: 1002,
      customerId: customers[1].id,
      type: OrderType.DINE_IN,
      status: OrderStatus.PREPARING,
      size: MealSize.G,
      protein: beef.id,
      bean: blackBeans.id,
      bases: [rice.id, pasta.id],
      products: [
        {
          productId: juice.id,
          quantity: 1,
        },
      ],
      paymentMethod: PaymentMethod.CREDIT_CARD,
      paymentStatus: PaymentStatus.PAID,
      createdAt: now,
    }),

    // ---------------------------------------------------------
    // PEDIDO 3
    // ---------------------------------------------------------

    createOrder({
      orderNumber: 1003,
      customerId: customers[2].id,
      type: OrderType.TAKEAWAY,
      status: OrderStatus.READY,
      size: MealSize.M,
      protein: sausage.id,
      bean: tropeiroBeans.id,
      bases: [rice.id],
      products: [
        {
          productId: guarana.id,
          quantity: 2,
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      paymentStatus: PaymentStatus.PAID,
      createdAt: now,
    }),

    // ---------------------------------------------------------
    // PEDIDO 4
    // ---------------------------------------------------------

    createOrder({
      orderNumber: 1004,
      customerId: customers[3].id,
      type: OrderType.DELIVERY,
      status: OrderStatus.OUT_FOR_DELIVERY,
      size: MealSize.G,
      protein: chicken.id,
      bean: beans.id,
      bases: [rice.id, mashedPotato.id],
      products: [
        {
          productId: cocaCola.id,
          quantity: 1,
        },
        {
          productId: pudding.id,
          quantity: 1,
        },
      ],
      paymentMethod: PaymentMethod.DEBIT_CARD,
      paymentStatus: PaymentStatus.PAID,
      createdAt: now,
    }),

    // ---------------------------------------------------------
    // PEDIDO 5
    // ---------------------------------------------------------

    createOrder({
      orderNumber: 1005,
      customerId: customers[0].id,
      type: OrderType.TAKEAWAY,
      status: OrderStatus.WAITING_PICKUP,
      size: MealSize.M,
      protein: beef.id,
      bean: blackBeans.id,
      bases: [rice.id],
      products: [
        {
          productId: brigadeiro.id,
          quantity: 2,
        },
      ],
      paymentMethod: PaymentMethod.PIX,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: now,
    }),

    // ---------------------------------------------------------
    // PEDIDO 6
    // ---------------------------------------------------------

    createOrder({
      orderNumber: 1006,
      customerId: customers[1].id,
      type: OrderType.DINE_IN,
      status: OrderStatus.FINISHED,
      size: MealSize.G,
      protein: sausage.id,
      bean: beans.id,
      bases: [rice.id, pasta.id],
      products: [
        {
          productId: salad.id,
          quantity: 1,
        },
        {
          productId: juice.id,
          quantity: 1,
        },
      ],
      paymentMethod: PaymentMethod.CREDIT_CARD,
      paymentStatus: PaymentStatus.PAID,
      createdAt: yesterday,
    }),

    // ---------------------------------------------------------
    // PEDIDO 7
    // ---------------------------------------------------------

    createOrder({
      orderNumber: 1007,
      customerId: customers[2].id,
      type: OrderType.DELIVERY,
      status: OrderStatus.CANCELED,
      size: MealSize.M,
      protein: chicken.id,
      bean: tropeiroBeans.id,
      bases: [rice.id],
      paymentMethod: PaymentMethod.PIX,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: yesterday,
      observation: 'Pedido cancelado pelo cliente.',
    }),

    // ---------------------------------------------------------
    // PEDIDO 8
    // ---------------------------------------------------------

    createOrder({
      orderNumber: 1008,
      customerId: customers[3].id,
      type: OrderType.TAKEAWAY,
      status: OrderStatus.FINISHED,
      size: MealSize.M,
      protein: beef.id,
      bean: beans.id,
      bases: [rice.id],
      products: [
        {
          productId: cocaCola.id,
          quantity: 1,
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      paymentStatus: PaymentStatus.PAID,
      createdAt: yesterday,
    }),

    // ---------------------------------------------------------
    // PEDIDO 9
    // ---------------------------------------------------------

    createOrder({
      orderNumber: 1009,
      customerId: customers[0].id,
      type: OrderType.DINE_IN,
      status: OrderStatus.FINISHED,
      size: MealSize.G,
      protein: chicken.id,
      bean: blackBeans.id,
      bases: [rice.id, mashedPotato.id],
      products: [
        {
          productId: pudding.id,
          quantity: 1,
        },
      ],
      paymentMethod: PaymentMethod.DEBIT_CARD,
      paymentStatus: PaymentStatus.PAID,
      createdAt: twoDaysAgo,
    }),

    // ---------------------------------------------------------
    // PEDIDO 10
    // ---------------------------------------------------------

    createOrder({
      orderNumber: 1010,
      customerId: customers[2].id,
      type: OrderType.DELIVERY,
      status: OrderStatus.FINISHED,
      size: MealSize.M,
      protein: sausage.id,
      bean: tropeiroBeans.id,
      bases: [rice.id],
      products: [
        {
          productId: guarana.id,
          quantity: 1,
        },
        {
          productId: farofa.id,
          quantity: 1,
        },
      ],
      paymentMethod: PaymentMethod.PIX,
      paymentStatus: PaymentStatus.PAID,
      createdAt: twoDaysAgo,
    }),
  ];

  await Promise.all(orders);

  console.log('✅ 10 pedidos criados');

  // =========================================================
  // RESUMO
  // =========================================================

  console.log('');
  console.log('==========================================');
  console.log('🌱 SEED CONCLUÍDO');
  console.log('==========================================');
  console.log('');
  console.log('👤 ADMIN');
  console.log('Email: admin@comidafeliz.com');
  console.log('Senha: Admin@123');
  console.log('');
  console.log('👥 Clientes: 4');
  console.log('🥩 Ingredientes: 10');
  console.log('📦 Categorias: 3');
  console.log('🍹 Produtos: 7');
  console.log('🧾 Pedidos: 10');
  console.log('');
  console.log('💰 Preços das marmitas');
  console.log('M: R$ 20,00');
  console.log('G: R$ 30,00');
  console.log('');
  console.log('==========================================');
}

main()
  .catch((error) => {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });