import { Resolver, Query, Authorized, Arg, Ctx, Mutation } from "type-graphql";
import { User, UpdateUserInput } from "../entities";
import { ADMIN } from "../consts";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { IContext } from "../interfaces";
import { assertIsDefined } from "../utils/assert";

@Resolver()
export class UserResolver {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>
  ) {}

  @Authorized([ADMIN])
  @Query(() => [User])
  async allUsers() {
    return await this.UserRepository.find({});
  }

  @Authorized([ADMIN])
  @Mutation(() => User)
  async updateUser(
    @Arg("user", () => UpdateUserInput) { email, name, admin }: UpdateUserInput
  ) {
    const user = await this.UserRepository.findOneOrFail(email);

    user.name = name;
    user.admin = admin;

    await this.UserRepository.save(user);

    return user;
  }

  @Authorized([ADMIN])
  @Mutation(() => Boolean)
  async removeUser(
    @Ctx() { user: authenticatedUser }: IContext,
    @Arg("email") email: string
  ) {
    assertIsDefined(authenticatedUser, "Authorization is not working properly");

    if (email !== authenticatedUser.email) {
      const user = await this.UserRepository.findOne({
        email,
        active: true,
      });
      if (user) {
        user.active = false;
        await this.UserRepository.save(user);

        return true;
      }
    }

    return false;
  }
}
