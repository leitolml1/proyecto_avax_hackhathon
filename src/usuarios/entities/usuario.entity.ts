import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Usuario {
  @PrimaryColumn()
  address: string;

  @Column("text", {
    array: true,
    default: ["user"],
  })
  role: string[];

  @CreateDateColumn()
  created_at: Date;
}
