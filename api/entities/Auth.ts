import { InputType, Field } from "type-graphql";
import { IsEmail, IsHash, Length } from "class-validator";

@InputType()
export class LoginInput {
  @IsEmail()
  @Field()
  email: string;

  @IsHash("sha512")
  @Field()
  password: string;
}

@InputType()
export class SignUpInput {
  @IsEmail()
  @Field()
  email: string;

  @IsHash("sha512")
  @Field()
  password: string;

  @Length(1, 50)
  @Field()
  name: string;
}
