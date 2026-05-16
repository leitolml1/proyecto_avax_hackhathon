import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import {   Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


type CreateProductoWithSeller = CreateProductoDto & {
  seller: string;
};
@Injectable()
export class ProductosService {
  
  constructor(
    @InjectRepository(Producto)
    private productRepository:Repository<Producto>,
  ){}

  async create(createProductoDto: CreateProductoWithSeller) {
    const producto=
      this.productRepository.create(createProductoDto)
    return await this.productRepository.save(producto)
  }

  findAllProducts():Promise <Producto[]> {
    return this.productRepository.find()
  }

  //El usuario envia su address y obtiene sus productos creados en base a tu direccion!
  findAllProductsByUser(userAdress:string) {
    return this.productRepository.find({
      where:{
        seller:userAdress
      }
    })
  }

  async findOne(id_product: string) {
    const producto=await this.productRepository.findOne({
      where:{
        id_product,
      }
    })
    if(!producto){
      throw new Error("Producto no encontrado con el id")
    }
    return producto

  }

  async update(
    ownerAddress:string,
    id_product: string, 
    updateProductoDto: UpdateProductoDto
  ) {
    const producto=await this.findOne(id_product)
    if(producto.seller!=ownerAddress){
      throw new ForbiddenException("No podes actualizar este producto")
    }
    Object.assign(producto,updateProductoDto)
    return this.productRepository.save(producto)
  }

  async remove(id_product:string,ownerAdress:string) {
    
    const producto=this.productRepository.findOne({
      where:{
        seller:ownerAdress,
        id_product
      }
    })
    if(!producto){
      throw new NotFoundException("Produto no encontrado con ese ID")
    }
  }
}


