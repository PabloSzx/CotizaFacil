import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import _ from "lodash";
import { buildSchemaSync } from "type-graphql";
import { Container as container } from "typedi";

import * as resolvers from "./resolvers";
import { authChecker, buildContext } from "./utils";

const apolloServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: _.values(resolvers),
    container,
    authChecker,
  }),
  introspection: true,
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
  context: ({ req }) => buildContext({ req }),
});

export const apollo = (app: Express) => {
  apolloServer.applyMiddleware({
    app,
    path: "/api/graphql",
  });
};
