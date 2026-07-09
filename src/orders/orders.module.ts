import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { MealsModule } from './meals/meals.module';
import { MealBasesModule } from './meal-bases/meal-bases.module';
import { OrderProductsModule } from './order-products/order-products.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [PaymentsModule, MealsModule, MealBasesModule, OrderProductsModule],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
