import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from "bcrypt"
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    private jwtService:JwtService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const hashedPassword=await bcrypt.hash(createUsuarioDto.password,10)
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password:hashedPassword
    });
    return this.usuarioRepository.save(usuario);
  }

  async login(loginUsuarioDto:LoginUsuarioDto){
    const usuario=await this.usuarioRepository.findOne({
      where:{
        email:loginUsuarioDto.email,
      }
    })
    if(!usuario){
      throw new UnauthorizedException("Email o contraseña incorrecta!")
    }
    const passwordValid=await bcrypt.compare(
      loginUsuarioDto.password,
      usuario.password
    )
    if(!passwordValid){
      throw new UnauthorizedException("Email o contraseña incorrecta!")
    }
    const payload={
      address:usuario.address,
      email:usuario.email,
      role:usuario.email
    }
    const token=await this.jwtService.signAsync(payload)
  
    return{
      message:"Bienvenido usuario!",
      usuario:usuario.username,
      email:usuario.email,
      token

    }
  }
  logout() {
  return {
    message: 'Logout correcto',
  };
}

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(address: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { address },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado con esa address');
    }

    return usuario;
  }

  async update(
    address: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.findOne(address);

    Object.assign(usuario, updateUsuarioDto);

    return this.usuarioRepository.save(usuario);
  }

  async remove(address: string): Promise<{ message: string }> {
    const usuario = await this.findOne(address);

    await this.usuarioRepository.remove(usuario);

    return {
      message: 'Usuario eliminado correctamente',
    };
  }
}
