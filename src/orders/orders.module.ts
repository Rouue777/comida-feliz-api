import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CustomersModule } from 'src/customers/customers.module';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  imports: [CustomersModule],
  providers: [OrdersService, PrismaService],
  controllers: [OrdersController]
})
export class OrdersModule {}
