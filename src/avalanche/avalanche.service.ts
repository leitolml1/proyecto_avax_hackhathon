import { Injectable } from '@nestjs/common';
import {ethers} from "ethers"
import { metadata } from 'reflect-metadata/no-conflict';
@Injectable()
export class AvalancheService {


    private provider:ethers.JsonRpcProvider

    constructor(){

        const rpc=process.env.URL_FUJI
        if(!rpc){
            throw new Error("URL_FUJI no esta definida!")
        }

        this.provider=new ethers.JsonRpcProvider(
            rpc
        )
    }
    async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }
  async getBalance(address:string){
    const balance=
        await this.provider.getBalance(address)
    return ethers.formatEther(balance)
  }

  async registerProduct(product: any) {

    const hash = ethers.id(
      JSON.stringify(product)
    );

    return {
      blockchain: 'Avalanche Fuji',
      hash,
      timestamp: Date.now(),
    };
  }
}
