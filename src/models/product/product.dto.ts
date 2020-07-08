import { IsOptional, IsString, ValidateNested, IsUUID, IsEmail, IsNumber } from 'class-validator';

export default class ProductDto {

  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsString()
  public category: string;

  @IsNumber()
  public price: string;

  @IsNumber()
  public stock: string;

  constructor(){}

}
