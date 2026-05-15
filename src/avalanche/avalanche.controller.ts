import { Controller, Get, Param } from '@nestjs/common';
import { AvalancheService } from './avalanche.service';

@Controller('avalanche')
export class AvalancheController {

  constructor(
    private readonly avalancheService: AvalancheService
  ) {}

  @Get('block')
  async getBlock() {
    return await this.avalancheService.getBlockNumber();
  }
  @Get("balance/:address")
    async balance(
        @Param("address") address:string
    ){
        return this.avalancheService.getBalance(address)
    }
  
}