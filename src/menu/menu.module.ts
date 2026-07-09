import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { IngredientsModule } from './ingredients/ingredients.module';

@Module({
  imports: [CategoriesModule, ProductsModule, IngredientsModule]
})
export class MenuModule {}
