import puppeteer from "puppeteer";

const browser = puppeteer.launch();

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

  const products: { content: string; price: string }[] = [];

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

      const products: {
        content: string;
        price: string;
        link: string;
      }[] = [];

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
        if (!titleSelector || !priceSelector || !linkSelector) {
          return;
        }

        log += ``;

        const productData = {
          content: titleSelector.textContent?.trim() ?? "",
          price: priceSelector.textContent?.trim() ?? "",
          link: linkSelector.getAttribute("href") ?? ""
        };

        if (productData.content && productData.price && productData.link) {
          products.push({
            ...productData,
            link: `${sodimacWebsite}${productData.link}`
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

    if (pageNumber < totalPages) {
      await getPageData(pageNumber + 1);
    }
  };

  await getPageData();

  await page.close();

  return products;
};

getSodimacData("martillo").then(data => {
  console.log({
    data
  });
});
