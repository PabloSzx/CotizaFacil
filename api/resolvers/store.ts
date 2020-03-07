import assert from "assert";
import { some } from "lodash";
import {
  Arg,
  Authorized,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ADMIN } from "../consts";
import { CreateStoreInput, EditStoreInput, Store } from "../entities/Store";
import { updateSetTemplate } from "../utils/upsert";

@Resolver(() => Store)
export class StoreResolver {
  constructor(
    @InjectRepository(Store) private readonly StoreRepository: Repository<Store>
  ) {}

  @Authorized([ADMIN])
  @Mutation(() => Store)
  async upsertStore(
    @Arg("store", () => CreateStoreInput) storeInput: CreateStoreInput
  ) {
    await this.StoreRepository.createQueryBuilder()
      .insert()

      .values(storeInput)
      .updateEntity(true)
      .onConflict(
        updateSetTemplate(
          { ...storeInput, active: true },
          {
            conflictKeys: "name",
            ignoreKeys: ["name"]
          }
        )
      )
      .execute();

    return await this.StoreRepository.findOneOrFail(storeInput.name);
  }

  @Authorized([ADMIN])
  @Mutation(() => Store)
  async editStore(
    @Arg("store", () => EditStoreInput)
    { oldName, ...storeInput }: EditStoreInput
  ) {
    assert(some(storeInput), new Error("No update parameters given!"));

    const editedStore = await this.StoreRepository.update(
      {
        name: oldName
      },
      { ...storeInput, active: true }
    );

    assert((editedStore.affected ?? 0) > 0, new Error("Store not found!"));

    return await this.StoreRepository.findOneOrFail(storeInput.name || oldName);
  }

  @Authorized([ADMIN])
  @Mutation(() => Store)
  async removeStore(@Arg("storeName") storeName: string) {
    const store = await this.StoreRepository.findOneOrFail(storeName);

    store.active = false;

    await this.StoreRepository.save(store);

    return store;
  }

  @Query(() => [Store])
  async stores() {
    return await this.StoreRepository.find({
      active: true
    });
  }
}
