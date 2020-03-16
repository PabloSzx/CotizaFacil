import assert from "assert";
import { sample } from "lodash";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { In, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Store } from "../entities";
import { Product } from "../entities/Product";
import { getSodimacData } from "../scrapping/sodimac";

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    @InjectRepository(Store)
    private readonly StoreRepository: Repository<Store>,
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>
  ) {}

  @Mutation(() => [Product])
  async searchProduct(
    @Arg("productName") productName: string,
    @Arg("storeNames", () => [String]) storeNames: string[]
  ) {
    const stores = await this.StoreRepository.find(
      storeNames.length > 0
        ? {
            name: In(storeNames)
          }
        : {}
    );

    assert(stores.length > 0, new Error("Stores not found!"));

    const products = (await getSodimacData(productName)).map(product => {
      return this.ProductRepository.create({
        ...product,
        store: sample(stores),
        updated_date: new Date()
      });
    });

    if (products.length === 0) {
      return [];
    }

    await this.ProductRepository.createQueryBuilder()
      .insert()
      .values(products)
      .updateEntity(true)
      .onConflict(
        `(url) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, image = EXCLUDED.image, updated_date = EXCLUDED.updated_date`
      )
      .returning("*")
      .execute();

    return products;
  }

  @Query(() => [Product])
  async allProducts() {
    return await this.ProductRepository.find({});
  }
}
