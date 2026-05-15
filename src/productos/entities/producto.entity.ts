import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id_product: string;

  @Column('text')
  name: string;

  @Column('text')
  seller: string;

  @Column('text')
  nro_pedido: string;

  @Column('decimal')
  price: number;

  @CreateDateColumn()
  create: Date;

  @Column({
    nullable: true,
  })
  image_url: string;
}
