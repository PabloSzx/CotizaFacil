import assert from "assert";
import { sortBy } from "lodash";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { In, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import ms from "ms";
import { priceStringToNumber } from "../../shared/utils";
import { Store } from "../entities";
import { Product } from "../entities/Product";
import { getEasyData, getSodimacData } from "../scrapping";
import LRU from "lru-cache";

let productParametersToString = ({
  product,
  stores,
}: {
  product: string;
  stores: string[];
}) => {
  return `${product}|${stores.join("-")}`;
};

const searchResultsCache = new LRU<
  string,
  Pick<Product, "image" | "name" | "price" | "store" | "url" | "updated_date">[]
>({
  maxAge: ms("30 minutes"),
});

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
            name: In(storeNames),
          }
        : {}
    );

    assert(stores.length > 0, new Error("Stores not found!"));

    const cacheKey = productParametersToString({
      product: productName,
      stores: stores.map(({ name }) => name),
    });

    const cachedResult = searchResultsCache.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    let products: Pick<
      Product,
      "image" | "name" | "price" | "store" | "url" | "updated_date"
    >[] = [];

    const searchPromises: Promise<any>[] = [];

    const sodimacFind = stores.find((store) => store.name === "Sodimac");
    const easyFind = stores.find((store) => store.name === "Easy");

    if (sodimacFind) {
      searchPromises.push(
        new Promise(async (resolve, reject) => {
          try {
            products.push(
              ...(await getSodimacData(productName)).map(({ ...rest }) => ({
                ...rest,
                store: sodimacFind,
                updated_date: new Date(),
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
                updated_date: new Date(),
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

    products = sortBy(products, (product) => {
      return priceStringToNumber(product.price);
    }).map(({ name, image, url, price, ...rest }) => ({
      name: name.trim(),
      image: image.trim(),
      url: url.trim(),
      price: price.trim().replace(/c\/u/i, ""),
      ...rest,
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

    searchResultsCache.set(cacheKey, products);

    return products;
  }

  @Query(() => [Product])
  async allProducts() {
    return await this.ProductRepository.find({});
  }
}
