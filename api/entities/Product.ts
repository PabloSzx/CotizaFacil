import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";

import { Quotation } from "./Quotation";
import { Store } from "./Store";

@Entity()
@ObjectType()
export class Product {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  price: string;

  @Field()
  @PrimaryColumn()
  url: string;

  @Field()
  @Column()
  image: string;

  @Field()
  @Column({ default: () => "CURRENT_TIMESTAMP" })
  updated_date: Date;

  @ManyToOne(
    () => Store,
    store => store.name,
    {
      eager: true,
      nullable: false
    }
  )
  @Field(() => Store)
  store: Store;

  @ManyToMany(
    () => Quotation,
    quotation => quotation.products
  )
  quotations: Quotation[];
}
