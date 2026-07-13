import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MealSize, OrderType, PaymentMethod } from '@prisma/client';

export class CreateMealDto {
  @IsEnum(MealSize)
  size!: MealSize;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  baseIds!: string[];

  @IsUUID()
  proteinId!: string;

  @IsUUID()
  beanId!: string;

  @IsOptional()
  @IsUUID()
  sideId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderExtraDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

 export class CreateOrderDto {
  @IsString()
  phone!: string;

  @IsEnum(OrderType)
  orderType!: OrderType;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateMealDto)
  meals!: CreateMealDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderExtraDto)
  extras?: CreateOrderExtraDto[];
}