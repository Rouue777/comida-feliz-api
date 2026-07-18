import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Pedidos do dia
    const ordersToday = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Receita do dia (não considera cancelados)
    const revenueToday = ordersToday
      .filter(order => order.status !== OrderStatus.CANCELED)
      .reduce((total, order) => total + Number(order.total), 0);

    return {
      ordersToday: ordersToday.length,

      revenueToday,

      preparing: ordersToday.filter(
        order => order.status === OrderStatus.PREPARING,
      ).length,

      ready: ordersToday.filter(
        order => order.status === OrderStatus.READY,
      ).length,

      delivery: ordersToday.filter(
        order => order.status === OrderStatus.OUT_FOR_DELIVERY,
      ).length,

      finished: ordersToday.filter(
        order => order.status === OrderStatus.FINISHED,
      ).length,

      canceled: ordersToday.filter(
        order => order.status === OrderStatus.CANCELED,
      ).length,
    };
  }

/////////////////////////////////////////////////////
// PEDIDOS RECENTES
/////////////////////////////////////////////////////

async recentOrders() {
  return await this.prisma.order.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
      customer: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
  });
}

}