import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import _ from "lodash";
import { buildSchemaSync } from "type-graphql";

import * as resolvers from "./resolvers";

const apolloServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: _.values(resolvers),
  }),
  introspection: true,
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
});

export const apollo = (app: Express) => {
  apolloServer.applyMiddleware({
    app,
    path: "/api/graphql",
  });
};
