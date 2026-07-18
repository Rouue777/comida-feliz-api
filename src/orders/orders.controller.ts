import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './createOrder.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { use } from 'passport';
import { retry } from 'rxjs';
import { UpdateOrderStatusDto } from './updateOrderStatusDto.dto';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {

    constructor(private orderService : OrdersService){}



//criar pedido 

@UseGuards(JwtAuthGuard)
@Post()
async create(
    @Body() dto : CreateOrderDto,
    @Req() req ,
){
   console.log(req.user.sub);
    return this.orderService.create(dto, req.user.sub)

}


//buscar pedido pelo id
@UseGuards(JwtAuthGuard)
@Get(':orderId')
async getByid(
    @Param('orderId') idOrder : string
){

     return this.orderService.buscarPedidoById(idOrder)
  
}


///listar todos pedidos
@UseGuards(JwtAuthGuard)
@Get('/')
async getAll(){

    return this.orderService.listarPedidos()
}

///alterar status do pedido
@UseGuards(JwtAuthGuard)
@Patch(':orderId/status')
async alterarStatus(
    @Param("orderId") idOrder : string,
    @Body()  updateStatus : UpdateOrderStatusDto
){

    return this.orderService.alteraStatus(updateStatus, idOrder)

}

///cancelar pedido
@UseGuards(JwtAuthGuard)
@Patch(":orderId/cancel")
async cancelOrder(
    @Param('orderId') idOrder : string
){ 
    return this.orderService.cancelarPedido(idOrder)
}


////-- buscar pedidos por status
@UseGuards(JwtAuthGuard)
@Get('status/:status')
async buscarPorStatus(
  @Param('status') status: OrderStatus,
) {
  return this.orderService.buscarPedidosPorStatus(status);
}



}