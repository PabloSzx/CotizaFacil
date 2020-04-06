import { Field, ObjectType, InputType } from "type-graphql";
import { Column, Entity, PrimaryColumn, Index } from "typeorm";
import { IsEmail, Length } from "class-validator";

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

  @Field()
  @Index()
  @Column({ default: true })
  active: boolean;
}

@InputType()
export class UpdateUserInput {
  @IsEmail()
  @Field()
  email: string;

  @Length(1, 50)
  @Field()
  name: string;

  @Field()
  admin: boolean;
}
