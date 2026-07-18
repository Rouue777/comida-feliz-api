import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IngredientType } from '@prisma/client';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(IngredientType)
  type!: IngredientType;
}