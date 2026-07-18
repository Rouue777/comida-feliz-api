import { IsBoolean } from 'class-validator';

export class UpdateIngredientAvailabilityDto {
  @IsBoolean()
  available!: boolean;
}