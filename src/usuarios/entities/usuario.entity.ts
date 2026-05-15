import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Usuario {

  @PrimaryColumn(
    {unique:true}
  )
  address: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column("text", {
    array: true,
    default: ["user"],
  })
  role: string[];

  @CreateDateColumn()
  created_at: Date;
}