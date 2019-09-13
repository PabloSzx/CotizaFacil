import "reflect-metadata";

import express from "express";
import next from "next";
import notifier from "node-notifier";

import { apollo, common } from "./src/server";
import { auth } from "./src/server/middleware/passport";

const server = express();

server.use(common);

server.use(auth);

apollo(server);

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const nextHandle = nextApp.getRequestHandler();
nextApp.prepare().then(() => {
  server.use((req, res) => nextHandle(req, res));

  const port = process.env.PORT || 3000;
  server.listen({ port }, () => {
    const message = `Server Listening on port ${port}!`;
    console.log(message);
    if (process.env.NODE_ENV !== "production") {
      notifier.notify({
        title: "🚀  Server ready",
        message: `at http://localhost:${port}`,
      });
    }
  });
});
