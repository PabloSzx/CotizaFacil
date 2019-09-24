import express from "express";
import proxy from "http-proxy-middleware";
import notifier from "node-notifier";

const app = express();

app.use("/api", proxy(`http://localhost:4000`));
app.use(proxy(`http://localhost:3000`));

app.listen(8000, () => {
  console.log("Proxy Server ready at http://localhost:8000");
  notifier.notify({
    title: "🚀  Proxy Server ready",
    message: `at http://localhost:${8000}`,
  });
});
