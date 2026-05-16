import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

const ESCROW_ABI = [
  'function createTrade(address seller) external returns (uint256)',
  'function fundTrade(uint256 tradeId) external payable',
  'function confirmDelivery(uint256 tradeId) external',
  'function cancelTrade(uint256 tradeId) external',
  'function nextTradeId() view returns (uint256)',
  'function trades(uint256) view returns (address seller, address buyer, uint256 amount, uint8 status)',
  'event TradeCreated(uint256 indexed tradeId, address indexed seller, address indexed buyer)',
  'event TradeFunded(uint256 indexed tradeId, address indexed buyer, uint256 amount)',
  'event TradeReleased(uint256 indexed tradeId, address indexed seller, uint256 amount)',
  'event TradeCancelled(uint256 indexed tradeId)',
];

const TRADE_STATUS = ['created', 'funded', 'released', 'cancelled'] as const;

@Injectable()
export class AvalancheService {
  private provider: ethers.JsonRpcProvider;
  private escrowContract?: ethers.Contract;

  constructor() {
    const rpc = process.env.URL_FUJI;
    if (!rpc) {
      throw new Error('URL_FUJI no esta definida!');
    }

    this.provider = new ethers.JsonRpcProvider(rpc);

    if (process.env.ESCROW_CONTRACT_ADDRESS) {
      this.escrowContract = new ethers.Contract(
        process.env.ESCROW_CONTRACT_ADDRESS,
        ESCROW_ABI,
        this.provider,
      );
    }
  }

  getContractAddress() {
    return {
      network: 'Avalanche Fuji',
      chainId: 43113,
      contractAddress: process.env.ESCROW_CONTRACT_ADDRESS ?? null,
    };
  }

  getEscrowAbi() {
    return ESCROW_ABI;
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }

  async getBalance(address: string) {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getTrade(tradeId: string) {
    if (!this.escrowContract) {
      throw new Error('ESCROW_CONTRACT_ADDRESS no esta definida!');
    }

    const trade = await this.escrowContract.trades(tradeId);
    const status = Number(trade.status);

    return {
      tradeId,
      seller: trade.seller,
      buyer: trade.buyer,
      amountWei: trade.amount.toString(),
      amountAvax: ethers.formatEther(trade.amount),
      status,
      statusLabel: TRADE_STATUS[status] ?? 'unknown',
    };
  }

  async registerProduct(product: any) {
    const hash = ethers.id(JSON.stringify(product));

    return {
      blockchain: 'Avalanche Fuji',
      hash,
      timestamp: Date.now(),
    };
  }
}
