import "reflect-metadata";

import express from "express";
import proxy from "http-proxy-middleware";
import notifier from "node-notifier";

import { apollo, common } from "./src/server";
import { auth } from "./src/server/middleware/passport";

const server = express();

server.use(common);

server.use(auth);

apollo(server);

if (process.env.NODE_ENV !== "production")
  server.use(proxy(`http://localhost:3000`));

const port = process.env.PORT || 8000;
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
// });
