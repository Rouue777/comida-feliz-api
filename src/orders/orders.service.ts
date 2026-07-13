import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMealDto, CreateOrderExtraDto, CreateOrderDto } from './createOrder.dto';
import { CustomersService } from 'src/customers/customers.service';


@Injectable()
export class OrdersService {

    constructor(private prisma : PrismaService,
        private customerService : CustomersService
    ){
    }

//logica criacao do pedido
async createOrder(dtoOrder : CreateOrderDto, extraOrder : CreateOrderExtraDto, mealBase : CreateMealDto){



    






}



}
