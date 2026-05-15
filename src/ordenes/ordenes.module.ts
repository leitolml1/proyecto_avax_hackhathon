import { Module } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orden } from './entities/ordene.entity';

@Module({
  controllers: [OrdenesController],
  providers: [OrdenesService],
  imports:[TypeOrmModule.forFeature([Orden])]
})
export class OrdenesModule {}
