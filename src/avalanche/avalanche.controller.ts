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

  @Get('contract')
  contract() {
    return this.avalancheService.getContractAddress();
  }

  @Get('abi')
  abi() {
    return this.avalancheService.getEscrowAbi();
  }

  @Get('trade/:tradeId')
  trade(@Param('tradeId') tradeId: string) {
    return this.avalancheService.getTrade(tradeId);
  }

  @Get('balance/:address')
  async balance(@Param('address') address: string) {
    return this.avalancheService.getBalance(address);
  }
  
}
