import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { CreateOrdenDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { Orden } from './entities/ordene.entity';
@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden)
    private ordenRepository: Repository<Orden>,
  ) {}

  async create(createOrdenDto: CreateOrdenDto): Promise<Orden> {
    const orden = this.ordenRepository.create(createOrdenDto);
    return this.ordenRepository.save(orden);
  }

  findAll(): Promise<Orden[]> {
    return this.ordenRepository.find();
  }

  async findOne(id_order: string): Promise<Orden> {
    const orden = await this.ordenRepository.findOne({
      where: { id_order },
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada con ese ID');
    }

    return orden;
  }

  findByBuyer(buyer: string): Promise<Orden[]> {
    return this.ordenRepository.find({
      where: { buyer },
    });
  }

  findBySeller(seller: string): Promise<Orden[]> {
    return this.ordenRepository.find({
      where: { seller },
    });
  }

  async update(
    id_order: string,
    updateOrdenDto: UpdateOrdeneDto,
  ): Promise<Orden> {
    const orden = await this.findOne(id_order);

    Object.assign(orden, updateOrdenDto);

    return this.ordenRepository.save(orden);
  }

  async remove(id_order: string): Promise<{ message: string }> {
    const orden = await this.findOne(id_order);

    await this.ordenRepository.remove(orden);

    return {
      message: 'Orden eliminada correctamente',
    };
  }
}
