import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from 'src/usuarios/guards/jwt-auth.guard';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductoDto: CreateProductoDto, @Req() req: any) {
    return this.productosService.create({
      ...createProductoDto,
      seller: req.user.address,
    });
  }

  @Get()
  findAllProducts() {
    return this.productosService.findAllProducts();
  }

  @Get('user/:userAddress')
  findAllProductsByUser(@Param('userAddress') userAddress: string) {
    return this.productosService.findAllProductsByUser(userAddress);
  }

  @Get(':id_product')
  findOne(@Param('id_product') id_product: string) {
    return this.productosService.findOne(id_product);
  }

  @Patch(':id_product/:ownerAddress')
  update(
    @Param('id_product') id_product: string,
    @Param('ownerAddress') ownerAddress: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(
      ownerAddress,
      id_product,
      updateProductoDto,
    );
  }

  @Delete(':id_product/:ownerAddress')
  remove(
    @Param('id_product') id_product: string,
    @Param('ownerAddress') ownerAddress: string,
  ) {
    return this.productosService.remove(id_product, ownerAddress);
  }
}
