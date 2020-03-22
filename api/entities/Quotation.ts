import { ArrayMinSize, IsUrl, Length } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
    user => user.email,
    {
      eager: true
    }
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

@InputType()
export class QuotationCreate {
  @ArrayMinSize(1)
  @IsUrl(
    { protocols: ["https"] },
    {
      each: true
    }
  )
  @Field(() => [String])
  products: string[];

  @Length(1, 50)
  @Field()
  name: string;
}
