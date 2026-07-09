import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';

@Module({
  providers: [MealsService]
})
export class MealsModule {}
