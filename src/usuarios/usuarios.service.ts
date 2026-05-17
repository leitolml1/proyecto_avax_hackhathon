import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { WalletAuthDto } from './dto/wallet-auth.dto';
import { Usuario } from './entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';

const NONCE_TTL = 5 * 60 * 1000; // 5 min

@Injectable()
export class UsuariosService {
  private nonceStore = new Map<string, { nonce: string; message: string; expires: number }>();

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  generateNonce(address: string) {
    const nonce = crypto.randomUUID();
    const message = `AvaSafe quiere que inicies sesión con tu wallet\n\nAddress: ${address}\nNonce: ${nonce}\n\nEste mensaje no requiere gas ni realizará ninguna transacción.`;
    this.nonceStore.set(address.toLowerCase(), {
      nonce,
      message,
      expires: Date.now() + NONCE_TTL,
    });
    return { message, nonce };
  }

  async walletAuth(dto: WalletAuthDto) {
    const key = dto.address.toLowerCase();
    const stored = this.nonceStore.get(key);

    if (!stored || Date.now() > stored.expires) {
      this.nonceStore.delete(key);
      throw new UnauthorizedException('Nonce expirado. Solicita uno nuevo.');
    }

    let recovered: string;
    try {
      recovered = ethers.verifyMessage(stored.message, dto.signature);
    } catch {
      throw new UnauthorizedException('Firma inválida.');
    }

    if (recovered.toLowerCase() !== key) {
      throw new UnauthorizedException('La firma no coincide con la address.');
    }

    this.nonceStore.delete(key);

    let usuario = await this.usuarioRepository.findOne({ where: { address: dto.address } });

    if (!usuario) {
      usuario = this.usuarioRepository.create({ address: dto.address });
      usuario = await this.usuarioRepository.save(usuario);
    }

    const payload = { address: dto.address, role: usuario.role };
    const token = await this.jwtService.signAsync(payload);

    return { message: 'Autenticación exitosa', address: dto.address, token };
  }

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(address: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { address } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async update(address: string, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(address);
    Object.assign(usuario, dto);
    return this.usuarioRepository.save(usuario);
  }

  async remove(address: string): Promise<{ message: string }> {
    const usuario = await this.findOne(address);
    await this.usuarioRepository.remove(usuario);
    return { message: 'Usuario eliminado correctamente' };
  }
}
