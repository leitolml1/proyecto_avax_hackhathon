import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderState } from '../entities/ordene.entity';

export class CreateOrdenDto {
  @IsString()
  buyer: string;

  @IsString()
  seller: string;

  @IsString()
  nro_pedido: string;

  @IsOptional()
  @IsEnum(OrderState)
  state?: OrderState;
}
