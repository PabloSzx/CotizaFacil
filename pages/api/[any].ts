import { createProxyMiddleware } from "http-proxy-middleware";
import { PageConfig } from "next";

const port = process.env.PORT || 4000;

const silentWarn = (message: any) => {
  if (!message?.includes("API resolved without sending a response")) {
    console.error(message);
  }
};
console.warn = silentWarn;

export default createProxyMiddleware("http://localhost:" + port);

export const config: PageConfig = {
  api: {
    bodyParser: false
  }
};
