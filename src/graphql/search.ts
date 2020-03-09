import gql, { DocumentNode } from "graphql-tag-ts";

export type IProductQuery = {
  name: string;
  price: string;
  image: string;
  url: string;
  store: {
    name: string;
  };
};

export const SEARCH_PRODUCT: DocumentNode<
  {
    searchProduct: IProductQuery[];
  },
  { productName: string; storeNames: string[] }
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
  stores: {
    name: string;
    image: string;
    url: string;
  }[];
}> = gql`
  query {
    stores {
      name
      image
      url
    }
  }
`;
