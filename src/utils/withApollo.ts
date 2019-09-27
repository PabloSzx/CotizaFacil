import ApolloClient, { InMemoryCache } from "apollo-boost";
import nextWithApollo from "next-with-apollo";

import { GRAPHQL_URL } from "../consts";

declare module "next" {
  export interface NextPageContext {
    apolloClient: ApolloClient<any>;
  }
}

export const withApollo = nextWithApollo(
  ({ ctx, headers, initialState }) =>
    new ApolloClient({
      uri: GRAPHQL_URL,
      cache: new InMemoryCache({}).restore(initialState || {}),
    })
);
