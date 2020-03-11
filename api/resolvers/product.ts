import assert from "assert";
import { range, sample } from "lodash";
import { generate } from "randomstring";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { In, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Store } from "../entities";
import { Product } from "../entities/Product";

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

    const n = Math.round(Math.random() * 10) + 1;

    const products = range(0, n).map(() => {
      return this.ProductRepository.create({
        name:
          productName +
          generate({
            readable: true,
            length: 10,
            charset: "alphabetic"
          }),
        price: `$${generate({
          length: 5,
          charset: "numeric"
        })}`,
        url: `https://www.sodimac.cl/sodimac-cl/product/${generate({
          length: 7,
          charset: "numeric"
        })}`,
        image:
          "https://sodimac.scene7.com/is/image/SodimacCL/3569357?fmt=jpg&fit=constrain,1&wid=712&hei=712",
        store: sample(stores),
        updatedDate: new Date()
      });
    });

    return await this.ProductRepository.save(products);
  }

  @Query(() => [Product])
  async allProducts() {
    return await this.ProductRepository.find({});
  }
}
