import { IsUrl } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
@ObjectType()
export class Store {
  @PrimaryColumn({ unique: true, nullable: false })
  @Field()
  name: string;

  @Column({ nullable: false })
  @Field()
  url: string;

  @Column({ nullable: false })
  @Field()
  image: string;

  @Field({ nullable: false })
  @Column({ default: true })
  @Index()
  active: boolean;
}

@InputType()
export class CreateStoreInput implements Partial<Store> {
  @Field()
  name: string;

  @IsUrl({ protocols: ["https"] })
  @Field()
  url: string;

  @Field()
  @IsUrl({ protocols: ["https"] })
  image: string;
}

@InputType()
export class EditStoreInput implements Partial<Store> {
  @Field()
  oldName: string;

  @Field({ nullable: true })
  name: string;

  @IsUrl({ protocols: ["https"] })
  @Field({ nullable: true })
  url: string;

  @Field({ nullable: true })
  @IsUrl({ protocols: ["https"] })
  image: string;
}
