import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Product } from "./Product";
import { User } from "./User";

@Entity()
@ObjectType()
export class Quotation {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.email
  )
  user: User;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  date: Date;

  @ManyToMany(
    () => Product,
    product => product.url,
    {
      eager: true
    }
  )
  @JoinTable()
  @Field(() => [Product])
  products: Product[];
}
