import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDto } from '../ingredients/ingredientDto.dto';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}