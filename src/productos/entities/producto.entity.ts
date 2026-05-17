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

  @Column('text', { nullable: true })
  nro_pedido: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  category: string;

  @Column('text', { nullable: true })
  subcategory: string;

  @Column('text', { nullable: true })
  condition: string;

  @Column('text', { nullable: true })
  location: string;

  @Column('decimal')
  price: number;

  @CreateDateColumn()
  create: Date;

  @Column({ nullable: true })
  image_url: string;
}
