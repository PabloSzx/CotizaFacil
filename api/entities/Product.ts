import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

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

  @ManyToOne(
    () => Store,
    store => store.name,
    {
      eager: true
    }
  )
  @Field(() => Store)
  store: Store;
}
