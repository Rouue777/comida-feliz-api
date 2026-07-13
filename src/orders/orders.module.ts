import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { MealsModule } from './meals/meals.module';
import { MealBasesModule } from './meal-bases/meal-bases.module';
import { OrderProductsModule } from './order-products/order-products.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CustomersModule } from 'src/customers/customers.module';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  imports: [PaymentsModule, MealsModule, MealBasesModule, OrderProductsModule, CustomersModule],
  providers: [OrdersService, PrismaService],
  controllers: [OrdersController]
})
export class OrdersModule {}
