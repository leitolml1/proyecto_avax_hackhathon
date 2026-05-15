import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AvalancheModule } from './avalanche/avalanche.module';
import { OrdenesModule } from './ordenes/ordenes.module';

import { Producto } from './productos/entities/producto.entity';
import { Usuario } from './usuarios/entities/usuario.entity';
import { Orden } from './ordenes/entities/ordene.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [Producto, Usuario, Orden],
      synchronize: true,
    }),

    ProductosModule,
    UsuariosModule,
    AvalancheModule,
    OrdenesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
