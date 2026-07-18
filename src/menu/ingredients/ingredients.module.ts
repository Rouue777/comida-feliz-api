import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [IngredientsService, PrismaService],
  controllers: [IngredientsController],

})
export class IngredientsModule {}
