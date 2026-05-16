import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderState } from '../entities/ordene.entity';

export class CreateOrdenDto {
  @IsString()
  buyer: string;

  @IsString()
  seller: string;

  @IsString()
  nro_pedido: string;

  @IsOptional()
  @IsString()
  tradeId?: string;

  @IsOptional()
  @IsString()
  escrowTxHash?: string;

  @IsOptional()
  @IsString()
  fundTxHash?: string;

  @IsOptional()
  @IsNumber()
  amountAvax?: number;

  @IsOptional()
  @IsEnum(OrderState)
  state?: OrderState;
}
