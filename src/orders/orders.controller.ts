import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './createOrder.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { use } from 'passport';
import { retry } from 'rxjs';

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



}



