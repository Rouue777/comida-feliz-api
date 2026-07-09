import { Module } from '@nestjs/common';
import { OrderProductsService } from './order-products.service';

@Module({
  providers: [OrderProductsService]
})
export class OrderProductsModule {}
