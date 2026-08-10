import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  /////////////////////////////////////////////////////
  // RESUMO DO DASHBOARD
  /////////////////////////////////////////////////////

  @UseGuards(JwtAuthGuard)
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

@UseGuards(JwtAuthGuard)
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

@UseGuards(JwtAuthGuard)
@Get('kitchen')
async kitchenQueue() {
  const queue = await this.dashboardService.kitchenQueue();

  return {
    message: 'Fila da cozinha retornada com sucesso.',
    data: queue,
  };
}


/////////////////////////////////////////////////////
// MENU
/////////////////////////////////////////////////////

@UseGuards(JwtAuthGuard)
@Get('menu')
async menu() {
  const menu = await this.dashboardService.menu();

  return {
    message: 'Menu carregado com sucesso.',
    data: menu,
  };
}

@UseGuards(JwtAuthGuard)
@Get('summaryToday')
async summaryToday() {
  const summary = await this.dashboardService.getSummary();

  return {
    message: 'Resumo do dia retornado com sucesso.',
    data: summary,
  };
}

}


