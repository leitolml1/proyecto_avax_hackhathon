import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OrderState {
  ESCROW = 'escrow',
  PROCESO = 'proceso',
  CANCELADO = 'cancelado',
  COMPLETADO = 'completado',
}

@Entity()
export class Orden {
    //Se relacionan mediante el adress comprador y vendedor
  @PrimaryGeneratedColumn('uuid')
  id_order: string;

  @Column('text')
  buyer: string;

  @Column('text')
  seller: string;

  @CreateDateColumn()
  date_order: Date;

  @Column('text')
  nro_pedido: string;

  @Column('text', {
    nullable: true,
  })
  tradeId?: string;

  @Column('text', {
    nullable: true,
  })
  escrowTxHash?: string;

  @Column('text', {
    nullable: true,
  })
  fundTxHash?: string;

  @Column('decimal', {
    nullable: true,
  })
  amountAvax?: number;

  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.PROCESO,
  })
  state: OrderState;
}
