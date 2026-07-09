import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [    ConfigModule.forRoot({
      isGlobal: true,
    }),AuthModule, UsersModule, CustomersModule, MenuModule, OrdersModule, DashboardModule, PrismaModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
