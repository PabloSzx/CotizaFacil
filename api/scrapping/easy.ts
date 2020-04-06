import { uniqBy } from "lodash";

import { IProduct } from "../interfaces";
import { createBrowserInstance } from "./utils";

const browser = createBrowserInstance();

const pageLimit = 2;

const easyWebsite = "https://www.easy.cl";

const easyUrl = ({ name }: { name: string }) => {
  return `${easyWebsite}/tienda/search?query=${name}&cur_page=${pageLimit}&cur_view=list`;
};

export const getEasyData = async (name: string) => {
  const page = await (await browser).newPage();

  const products: IProduct[] = [];

  const getPageData = async () => {
    await page.goto(
      easyUrl({
        name,
      })
    );

    const data = await page.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const $products = document.querySelectorAll(".product");
      let log = "";

      const products: IProduct[] = [];

      $products.forEach(($product) => {
        const titleSelector = $product.querySelector(
          ".product_info .product_name"
        );
        const priceSelector = $product.querySelector(
          ".product_info .product_price"
        );
        const imageSelector = $product.querySelector(".product_image");
        if (!titleSelector || !priceSelector || !imageSelector) {
          log += ``;
          return;
        }

        const productData = {
          name: titleSelector.textContent?.trim() ?? "",
          price:
            priceSelector
              .getElementsByTagName("p")[0]
              ?.getElementsByTagName("span")[0]
              ?.textContent?.trim() ?? "",
          url: titleSelector.getAttribute("href") ?? "",
          image:
            imageSelector.getElementsByTagName("img")[0]?.getAttribute("src") ??
            "",
        };

        log += ``;

        if (
          productData.name &&
          productData.price &&
          productData.url &&
          productData.image
        ) {
          products.push({
            ...productData,
            url: `https://www.easy.cl${productData.url}`,
          });
        }
      });

      return {
        products,
        log,
      };
    });

    if (data.log) console.log("log", data.log);

    products.push(...data.products);
  };

  await getPageData();

  await page.close();

  const uniqProducts = uniqBy(products, (product) => product.url);

  return uniqProducts;
};

const closeBrowser = async () => {
  (await browser).close();
};

process.on("exit", closeBrowser);
process.on("SIGINT", closeBrowser);
process.on("SIGUSR1", closeBrowser);
process.on("SIGUSR2", closeBrowser);
