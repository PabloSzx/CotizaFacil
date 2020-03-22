import "reflect-metadata";
import "./scrapping/sodimac";
import "dotenv/config";

import express from "express";
import { express as voyagerMiddleware } from "graphql-voyager/middleware";
import notifier from "node-notifier";

import { apollo, common } from "./";
import { auth } from "./middleware/passport";

const server = express();

server.set("trust proxy", true);

server.use(common);

server.use("/api/voyager", voyagerMiddleware({ endpointUrl: "/api/graphql" }));

server.use(auth);

apollo(server);

const port = process.env.PORT || 4000;

try {
  server
    .listen(port, () => {
      const message = `API Server Listening on port ${port}!`;
      console.log(message);
      if (process.env.NODE_ENV !== "production") {
        notifier.notify({
          title: "🚀  API Server ready",
          message: `at http://localhost:${port}`
        });
      }
    })
    .on("error", err => {
      if (process.env.NODE_ENV !== "test") {
        console.error(err);
      }
    });
} catch (err) {}
