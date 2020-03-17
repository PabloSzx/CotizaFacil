import assert from "assert";
import { sortBy, toNumber } from "lodash";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { In, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Store } from "../entities";
import { Product } from "../entities/Product";
import { getEasyData, getSodimacData } from "../scrapping";

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

    let products: Pick<
      Product,
      "image" | "name" | "price" | "store" | "url" | "updated_date"
    >[] = [];

    const searchPromises: Promise<any>[] = [];

    const sodimacFind = stores.find(store => store.name === "Sodimac");
    const easyFind = stores.find(store => store.name === "Easy");

    if (sodimacFind) {
      searchPromises.push(
        new Promise(async (resolve, reject) => {
          try {
            products.push(
              ...(await getSodimacData(productName)).map(({ ...rest }) => ({
                ...rest,
                store: sodimacFind,
                updated_date: new Date()
              }))
            );
            resolve();
          } catch (err) {
            reject(err);
          }
        })
      );
    }

    if (easyFind) {
      searchPromises.push(
        new Promise(async (resolve, reject) => {
          try {
            products.push(
              ...(await getEasyData(productName)).map(({ ...rest }) => ({
                ...rest,
                store: easyFind,
                updated_date: new Date()
              }))
            );
            resolve();
          } catch (err) {
            reject(err);
          }
        })
      );
    }

    await Promise.all(searchPromises);

    if (products.length === 0) {
      return [];
    }

    products = sortBy(products, product => {
      return toNumber(
        product.price
          .replace(/\./g, "")
          .replace(/c\/u/i, "")
          .replace(/\$/, "")
      );
    }).map(({ name, image, url, price, ...rest }) => ({
      name: name.trim(),
      image: image.trim(),
      url: url.trim(),
      price: price.trim().replace(/c\/u/i, ""),
      ...rest
    }));

    // products.reverse();

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
