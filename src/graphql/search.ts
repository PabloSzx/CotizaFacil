import gql, { DocumentNode } from "graphql-tag-ts";

import {
  Mutation,
  MutationSearchProductArgs,
  Product,
  Query,
  Store,
} from "../../typings/graphql";
import { IfImplements } from "../../typings/utils";

export type IProductQuery = IfImplements<
  Pick<Product, "name" | "price" | "image" | "url"> & {
    store: Pick<Store, "name">;
  },
  Product
>;

export const SEARCH_PRODUCT: DocumentNode<
  {
    searchProduct: Array<
      IfImplements<IProductQuery, Mutation["searchProduct"][number]>
    >;
  },
  MutationSearchProductArgs
> = gql`
  mutation($productName: String!, $storeNames: [String!]!) {
    searchProduct(storeNames: $storeNames, productName: $productName) {
      name
      price
      image
      url
      store {
        name
      }
    }
  }
`;

export const ALL_STORES: DocumentNode<{
  stores: Array<
    IfImplements<Pick<Store, "name" | "image" | "url">, Query["stores"][number]>
  >;
}> = gql`
  query {
    stores {
      name
      image
      url
    }
  }
`;
