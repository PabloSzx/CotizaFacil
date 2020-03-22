import gql, { DocumentNode } from "graphql-tag-ts";

import {
  Mutation,
  MutationCreateQuotationArgs,
  MutationRemoveQuotationArgs,
  Product,
  Query,
  Quotation,
  Store,
} from "../../typings/graphql";
import { IfImplements } from "../../typings/utils";

export const MY_QUOTATIONS: DocumentNode<{
  myQuotations: Array<
    IfImplements<
      Pick<Quotation, "id" | "name" | "date"> & {
        products: Array<
          Pick<
            Quotation["products"][number],
            "name" | "price" | "url" | "image" | "updated_date"
          > & {
            store: Pick<Store, "name" | "url" | "image">;
          }
        >;
      },
      Query["myQuotations"][number]
    >
  >;
}> = gql`
  query {
    myQuotations {
      id
      name
      date
      products {
        name
        price
        url
        image
        updated_date
        store {
          name
          url
          image
        }
      }
    }
  }
`;

export const CREATE_QUOTATION: DocumentNode<
  {
    createQuotation: IfImplements<
      Pick<Quotation, "id" | "name" | "date"> & {
        products: Array<Pick<Product, "name" | "price" | "url">>;
      },
      Mutation["createQuotation"]
    >;
  },
  MutationCreateQuotationArgs
> = gql`
  mutation($quotation: QuotationCreate!) {
    createQuotation(quotation: $quotation) {
      id
      name
      date
      products {
        name
        price
      }
    }
  }
`;

export const REMOVE_QUOTATION: DocumentNode<
  {
    removeQuotation: Mutation["removeQuotation"];
  },
  MutationRemoveQuotationArgs
> = gql`
  mutation($quotation_id: Int!) {
    removeQuotation(quotation_id: $quotation_id)
  }
`;
