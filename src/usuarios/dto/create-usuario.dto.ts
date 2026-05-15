import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  address: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  role?: string[];
}
