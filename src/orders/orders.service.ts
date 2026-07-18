import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMealDto, CreateOrderDto } from './createOrder.dto';
import { CustomersService } from 'src/customers/customers.service';
import { CreateOrderProductDto } from './productDto.dto';
import { MealSize, OrderStatus, OrderType, PaymentStatus} from '@prisma/client';
import { CreatePaymentDto } from './paymentDto.dto';
import { UpdateOrderStatusDto } from './updateOrderStatusDto.dto';

@Injectable()
export class OrdersService {

    constructor(private prisma : PrismaService,
        private customerService : CustomersService
    ){
    }


////////////--logicas de negocio para criar o pedido--//////////////////////////////

//validate meal para validar os ingredientes das marmitas
private async validateMeal(meal: CreateMealDto){

  // Proteína
  const protein = await this.prisma.ingredient.findFirst({
    where: {
      id: meal.proteinId,
      type: 'PROTEIN',
      available: true,
    },
  });

  if (!protein) {
    throw new NotFoundException('Proteína inválida.');
  }

  // Feijão
  const bean = await this.prisma.ingredient.findFirst({
    where: {
      id: meal.beanId,
      type: 'BEAN',
      available: true,
    },
  });

  if (!bean) {
    throw new NotFoundException('Feijão inválido.');
  }

  // Bases
  for (const baseId of meal.baseIds) {

    const base = await this.prisma.ingredient.findFirst({
      where: {
        id: baseId,
        type: 'BASE',
        available: true,
      },
    });

    if (!base) {
      throw new NotFoundException(`Base ${baseId} inválida.`);
    }
  }
}

//validar varias marmitas
private async validateMeals(meals: CreateMealDto[]): Promise<void> {

  for (const meal of meals) {
    await this.validateMeal(meal);
  }

}


//validateProducts para validar produto
private async validateProducts(
  products: CreateOrderProductDto[],
) {

  for (const product of products) {

    const productExists = await this.prisma.product.findUnique({
      where: {
        id: product.productId,
      },
    });

    if (!productExists) {
      throw new NotFoundException(
        `Produto ${product.productId} não encontrado.`,
      );
    }

    if (!productExists.available) {
      throw new BadRequestException(
        `Produto ${productExists.name} está indisponível.`,
      );
    }
  }
}


//calculateMealTotal para calcular total do valor das marmitas
private async calculateMealTotal(
  meals: CreateMealDto[],
) {

  let total = 0;

  for (const meal of meals) {

    let unitPrice = 0;

    switch (meal.size) {
      case MealSize.M:
        unitPrice = 20;
        break;

      case MealSize.G:
        unitPrice = 30;
        break;
    }

    total += unitPrice;
  }

  return total;
}


//calculateProducts
private async calculateProductTotal(
  products: CreateOrderProductDto[],
) {

  let total = 0;

  for (const product of products) {

    const productExists = await this.prisma.product.findUnique({
      where: {
        id: product.productId,
      },
    });

    if (!productExists) {
      throw new NotFoundException(
        `Produto ${product.productId} não encontrado.`,
      );
    }

    total += Number(productExists.price) * product.quantity;
  }

  return total;
}

//calculando total da order 
private calculateOrderTotal(
  mealTotal: number,
  productTotal: number,
): number {

  return mealTotal + productTotal;
}


///
//generate orderNumber gerando numero do pedido (depois adicionar gerar numero de pedido diario ex : pedido 1 porque é o primeiro pedidod do dia)
private async generateOrderNumber(): Promise<number> {

  const lastOrder = await this.prisma.order.findFirst({
    orderBy: {
      orderNumber: 'desc',
    },
  });

  if (!lastOrder) {
    return 1;
  }

  return lastOrder.orderNumber + 1;
}

//----registra pedido na tabela order----//
private async createOrder(
  customerId: string,
  userId: string,
  type: OrderType,
  total: number,
){

  const orderNumber = await this.generateOrderNumber();

  const order = await this.prisma.order.create({
    data: {
      customerId,
      userId,
      type,
      total,
      orderNumber,
    },
  });

  return order;
}

///-- createMeals --///
private async createMeals(
  orderId: string,
  meals: CreateMealDto[],
){

  for (const meal of meals) {

    const unitPrice = meal.size === MealSize.M ? 20 : 30;

    await this.prisma.meal.create({
      data: {
        orderId,
        size: meal.size,
        proteinId: meal.proteinId,
        beanId: meal.beanId,
        unitPrice,
        subtotal: unitPrice,
        observation: meal.notes,

        bases: {
          create: meal.baseIds.map((baseId) => ({
            ingredientId: baseId,
          })),
        },
      },
    });

  }

}



///--criar produtos como sobremesa ou bebida----//////

private async createOrderProducts(
  orderId: string,
  products: CreateOrderProductDto[],
): Promise<void> {

  for (const product of products) {

    const productExists = await this.prisma.product.findUnique({
      where: {
        id: product.productId,
      },
    });

    if (!productExists) {
      throw new NotFoundException(
        `Produto ${product.productId} não encontrado.`,
      );
    }

    await this.prisma.orderProduct.create({
      data: {
        orderId,
        productId: product.productId,
        quantity: product.quantity,
        unitPrice: productExists.price,
        subtotal: Number(productExists.price) * product.quantity,
      },
    });
  }
}

//--criar payment create paymente--//
private async createPayment(
  orderId: string,
  paymentDto: CreatePaymentDto,
  total: number,
){

  await this.prisma.payment.create({
    data: {
      orderId,
      method: paymentDto.method,
      amount: total,
      status: PaymentStatus.PENDING,
    },
  });

}




////////////////////////--Service para rotas--//////////////////////////


///////create order 
async create(dto: CreateOrderDto, userId : string) {

  // Buscar cliente
  const customer = await this.customerService.IdentificarPorTel(dto.phone);

  // Validar marmitas
  await this.validateMeals(dto.meals);

  // Validar produtos (extras)
  if (dto.extras && dto.extras.length > 0) {
    await this.validateProducts(dto.extras);
  }

  // Calcular totais
  const mealTotal = await this.calculateMealTotal(dto.meals);

  const productTotal = dto.extras
    ? await this.calculateProductTotal(dto.extras)
    : 0;

  const orderTotal = this.calculateOrderTotal(
    mealTotal,
    productTotal,
  );

  // Criar pedido
  const order = await this.createOrder(
    customer.id,
    userId,
    dto.orderType,
    orderTotal,
  );

  // Criar marmitas
  await this.createMeals(order.id, dto.meals);

  // Criar produtos
  if (dto.extras && dto.extras.length > 0) {
    await this.createOrderProducts(order.id, dto.extras);
  }

  // Criar pagamento
  await this.createPayment(
    order.id,
    {
      method: dto.paymentMethod,
    },
    orderTotal,
  );

  return {
    message: 'Pedido criado com sucesso.',
    order,
  };
}



//service buscar pedidodo 

async buscarPedidoById(idOrder: string) {
  const order = await this.prisma.order.findUnique({
    where: {
      id: idOrder,
    },
    include: {
      customer: true,

      payment: true,

      meals: {
        include: {
          protein: true,

          bean: true,

          bases: {
            include: {
              ingredient: true,
            },
          },
        },
      },

      products: {
        include: {
          product: true,
        },
      },

      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    throw new NotFoundException('Pedido não encontrado.');
  }

  return order;
}

//listar pedidos
async listarPedidos() {
  const orders = await this.prisma.order.findMany({
    include: {
      customer: true,

      payment: true,

      meals: {
        include: {
          protein: true,
          bean: true,
          bases: {
            include: {
              ingredient: true,
            },
          },
        },
      },

      products: {
        include: {
          product: true,
        },
      },

      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return orders;
}


///-- alterar status 

async alteraStatus(
  statusDto: UpdateOrderStatusDto,
  idOrder: string,
) {
  // Verifica se o pedido existe
  await this.buscarPedidoById(idOrder);

  // Atualiza o status
  const order = await this.prisma.order.update({
    where: {
      id: idOrder,
    },
    data: {
      status: statusDto.status,
    },
  });

  return order;
}


//cancelar pedido
async cancelarPedido(idOrder: string) {
  await this.buscarPedidoById(idOrder);

  return this.prisma.order.update({
    where: {
      id: idOrder,
    },
    data: {
      status: OrderStatus.CANCELED,
    },
  });

  
}


}
