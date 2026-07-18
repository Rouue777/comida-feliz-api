import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './createOrder.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

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

}
