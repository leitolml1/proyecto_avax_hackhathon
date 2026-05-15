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

  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.PROCESO,
  })
  state: OrderState;
}
