import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import { values } from "lodash";
import { buildSchemaSync } from "type-graphql";
import { Container as container } from "typedi";

import * as resolvers from "./resolvers";
import { authChecker, buildContext } from "./utils";

export const apolloServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: values(resolvers) as any,
    container,
    authChecker,
    emitSchemaFile: true,
    validate: true
  }),
  introspection: true,
  playground: {
    settings: {
      "request.credentials": "include"
    }
  },
  context: ({ req, res }) => buildContext({ req, res })
});

export const apollo = (app: Express) => {
  apolloServer.applyMiddleware({
    app,
    path: "/api/graphql"
  });
};
