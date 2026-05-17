import { IsString } from 'class-validator';

export class WalletAuthDto {
  @IsString()
  address: string;

  @IsString()
  signature: string;
}
