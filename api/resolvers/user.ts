import { Resolver, Query, Authorized } from "type-graphql";
import { User } from "../entities";
import { ADMIN } from "../consts";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";

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
}
