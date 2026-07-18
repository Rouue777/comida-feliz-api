import {
  PrismaClient,
  IngredientType,
  Prisma,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seed...');

  ///////////////////////////////////////////////////////
  // CATEGORIAS
  ///////////////////////////////////////////////////////

  const bebidas = await prisma.category.upsert({
    where: {
      name: 'Bebidas',
    },
    update: {},
    create: {
      name: 'Bebidas',
    },
  });

  const sobremesas = await prisma.category.upsert({
    where: {
      name: 'Sobremesas',
    },
    update: {},
    create: {
      name: 'Sobremesas',
    },
  });

  ///////////////////////////////////////////////////////
  // INGREDIENTES
  ///////////////////////////////////////////////////////

  const ingredientes = [
    {
      name: 'Frango à Milanesa',
      type: IngredientType.PROTEIN,
    },
    {
      name: 'Assado de Boi',
      type: IngredientType.PROTEIN,
    },
    {
      name: 'Macarrão',
      type: IngredientType.BASE,
    },
    {
      name: 'Arroz',
      type: IngredientType.BASE,
    },
    {
      name: 'Purê de Batata',
      type: IngredientType.BASE,
    },
    {
      name: 'Batata Frita',
      type: IngredientType.BASE,
    },
    {
      name: 'Salada',
      type: IngredientType.BASE,
    },
    {
      name: 'Feijão de Caldo',
      type: IngredientType.BEAN,
    },
    {
      name: 'Feijão Tropeiro',
      type: IngredientType.BEAN,
    },
  ];

  for (const ingrediente of ingredientes) {

    const exists = await prisma.ingredient.findFirst({
      where: {
        name: ingrediente.name,
      },
    });

    if (!exists) {
      await prisma.ingredient.create({
        data: ingrediente,
      });
    }
  }

  ///////////////////////////////////////////////////////
  // PRODUTOS
  ///////////////////////////////////////////////////////

  const produtos = [
    {
      categoryId: bebidas.id,
      name: 'Coca-Cola',
      price: new Prisma.Decimal(6.50),
    },
    {
      categoryId: bebidas.id,
      name: 'Suco',
      price: new Prisma.Decimal(5.00),
    },
    {
      categoryId: sobremesas.id,
      name: 'Pudim',
      price: new Prisma.Decimal(8.00),
    },
  ];

  for (const produto of produtos) {

    const exists = await prisma.product.findFirst({
      where: {
        name: produto.name,
      },
    });

    if (!exists) {
      await prisma.product.create({
        data: produto,
      });
    }
  }

  console.log('✅ Seed executado com sucesso!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });