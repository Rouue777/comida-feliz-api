import { Module } from '@nestjs/common';
import { MealBasesService } from './meal-bases.service';

@Module({
  providers: [MealBasesService]
})
export class MealBasesModule {}
