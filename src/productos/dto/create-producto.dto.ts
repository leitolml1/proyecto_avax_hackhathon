import {
  IsString,
  IsUUID,
  IsNumber,
  IsDate,
  IsUrl,
  IsOptional,
} from "class-validator";

export class CreateProductoDto {
  

  @IsString()
  name: string;

  

  @IsNumber()
  price: number;

  @IsOptional()
  @IsDate()
  create: Date;

  @IsOptional()
  @IsUrl()
  image_url: string;
}