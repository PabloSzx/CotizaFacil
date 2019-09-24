import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import { values } from "lodash";
import { buildSchemaSync } from "type-graphql";
import { Container as container } from "typedi";

import * as resolvers from "./resolvers";
import { authChecker, buildContext } from "./utils";

export const apolloServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: values(resolvers),
    container,
    authChecker,
    emitSchemaFile: true,
  }),
  introspection: true,
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
  mocks: process.env.NODE_ENV === "test",
  context: ({ req }) => buildContext({ req }),
});

export const apollo = (app: Express) => {
  apolloServer.applyMiddleware({
    app,
    path: "/api/graphql",
  });
};
