import { Arg, Ctx, Mutation, Query } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { USER_ALREADY_EXISTS, WRONG_INFO } from "../consts";
import { User } from "../entities";
import { IContext } from "../interfaces";

export class AuthResolver {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>
  ) {}

  @Query(() => User, { nullable: true })
  async current_user(@Ctx() { isAuthenticated, user }: IContext) {
    if (isAuthenticated()) {
      return user;
    }
    return null;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { logout, isAuthenticated }: IContext) {
    if (isAuthenticated()) {
      logout();
      return true;
    }
    return false;
  }

  @Mutation(() => User)
  async login(
    @Ctx() { login }: IContext,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const user = await this.UserRepository.findOne(email);
    if (user) {
      if (user.password === password) {
        await login(user);
        return user;
      }
    }
    throw new Error(WRONG_INFO);
  }

  @Mutation(() => User, { nullable: true })
  async sign_up(
    @Ctx() { login }: IContext,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("name") name: string
  ) {
    try {
      let user = await this.UserRepository.findOne(email);

      if (!user) {
        user = this.UserRepository.create({
          email,
          password,
          name
        });
        await this.UserRepository.save(user);
        await login(user);
        return user;
      }

      throw new Error(USER_ALREADY_EXISTS);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
