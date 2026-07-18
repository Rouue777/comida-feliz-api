import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  /////////////////////////////////////////////////////
  // RESUMO DO DASHBOARD
  /////////////////////////////////////////////////////

  @Get('summary')
  async summary() {
    const dashboard = await this.dashboardService.summary();

    return {
      message: 'Resumo do dashboard retornado com sucesso.',
      data: dashboard,
    };
  }


/////////////////////////////////////////////////////
// PEDIDOS RECENTES
/////////////////////////////////////////////////////

@Get('recent-orders')
async recentOrders() {
  const orders = await this.dashboardService.recentOrders();

  return {
    message: 'Pedidos recentes encontrados com sucesso.',
    data: orders,
  };
}

/////////////////////////////////////////////////////
// FILA DA COZINHA
/////////////////////////////////////////////////////

@Get('kitchen')
async kitchenQueue() {
  const queue = await this.dashboardService.kitchenQueue();

  return {
    message: 'Fila da cozinha retornada com sucesso.',
    data: queue,
  };
}

}


