import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  address: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  role?: string[];
}
