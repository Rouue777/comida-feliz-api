import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}