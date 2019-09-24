import "reflect-metadata";

import express from "express";
import notifier from "node-notifier";

import { apollo, common } from "./src/server";
import { auth } from "./src/server/middleware/passport";

const server = express();

server.use(common);

server.use(auth);

apollo(server);

const port = process.env.PORT || 4000;

server.listen({ port }, () => {
  const message = `API Server Listening on port ${port}!`;
  console.log(message);
  if (process.env.NODE_ENV !== "production") {
    notifier.notify({
      title: "🚀  API Server ready",
      message: `at http://localhost:${port}`,
    });
  }
});
