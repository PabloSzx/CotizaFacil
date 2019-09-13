import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field()
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ default: false })
  admin: boolean;
}
