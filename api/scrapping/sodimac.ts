import { uniqBy } from "lodash";
import puppeteer from "puppeteer";

import { IProduct } from "../interfaces";

const browser = puppeteer.launch();

const pageLimit = 5;

const sodimacWebsite = "https://www.sodimac.cl";

const sodimacUrl = ({
  name,
  pageNumber
}: {
  name: string;
  pageNumber: number;
}) => {
  return `${sodimacWebsite}/sodimac-cl/search?Ntt=${name}&currentpage=${pageNumber}`;
};

export const getSodimacData = async (name: string) => {
  const page = await (await browser).newPage();

  const products: IProduct[] = [];

  const getPageData = async (pageNumber = 1) => {
    await page.goto(
      sodimacUrl({
        name,
        pageNumber
      })
    );

    let totalPages = 1;

    const data = await page.evaluate(() => {
      const $products = document.querySelectorAll(".product-wrapper");
      const $pagination = document.querySelectorAll(
        ".page-indicies .page-index .jsx-4278284191 "
      );

      const products: IProduct[] = [];

      const totalPages = Number(
        $pagination[$pagination.length - 1]?.textContent?.trim()
      );

      let log = "";
      $products.forEach($product => {
        const titleSelector = $product.querySelector(
          ".product #title-pdp-link"
        );
        const priceSelector = $product.querySelector(".product .price");
        const linkSelector = $product.querySelector(".link-primary");
        const imageSelector = $product.querySelector("img");
        if (
          !titleSelector ||
          !priceSelector ||
          !linkSelector ||
          !imageSelector
        ) {
          return;
        }

        log += ``;

        const productData = {
          name: titleSelector.textContent?.trim() ?? "",
          price: priceSelector.textContent?.trim() ?? "",
          url: linkSelector.getAttribute("href") ?? "",
          image: imageSelector.getAttribute("src") ?? ""
        };

        if (
          productData.name &&
          productData.price &&
          productData.url &&
          productData.image
        ) {
          products.push({
            ...productData,
            url: `https://www.sodimac.cl${productData.url}`
          });
        }
      });

      return {
        totalPages,
        products,
        log
      };
    });

    if (data.log) console.log("log", data.log);
    totalPages = data.totalPages;
    products.push(...data.products);

    if (pageNumber < totalPages && pageNumber < pageLimit) {
      await getPageData(pageNumber + 1);
    }
  };

  await getPageData();

  await page.close();

  const uniqProducts = uniqBy(products, product => product.url);

  return uniqProducts;
};

const closeBrowser = async () => {
  (await browser).close();
};

process.on("exit", closeBrowser);
process.on("SIGINT", closeBrowser);
process.on("SIGUSR1", closeBrowser);
process.on("SIGUSR2", closeBrowser);

// getSodimacData("martillo").then(data => {
//   console.log({
//     data
//   });
// });
