import { Module } from '@nestjs/common';
import { AvalancheService } from './avalanche.service';
import { AvalancheController } from './avalanche.controller';

@Module({
  controllers: [AvalancheController],
  providers: [AvalancheService],
})
export class AvalancheModule {}