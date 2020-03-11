const puppeteer = require("puppeteer");
const fs = require("fs");

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let products = [];

  async function getPageData(pageNumber = 1) {
    await page.goto(
      `https://www.sodimac.cl/sodimac-cl/search?Ntt=martillo&currentpage=${pageNumber}`
    );
    // await page.screenshot({
    //    path: 'sodimac.png',
    //    fullPage: true
    // })
    const data = await page.evaluate(() => {
      const $products = document.querySelectorAll(".product-wrapper");
      const $pagination = document.querySelectorAll(
        ".page-indicies .page-index .jsx-4278284191 "
      );
      const totalPages = Number(
        $pagination[$pagination.length - 1].textContent.trim()
      );
      const data = [];
      $products.forEach($product => {
        if (
          !$product.querySelector(".product #title-pdp-link") ||
          !$product.querySelector(".product .price")
        ) {
          return;
        }
        data.push({
          content: $product
            .querySelector(".product #title-pdp-link")
            .textContent.trim(),
          price: $product.querySelector(".product .price").textContent.trim()
        });
      });

      return {
        products: data,
        totalPages
      };
    });

    console.log(`page ${pageNumber} of ${data.totalPages} completed `);

    if (pageNumber < data.totalPages) {
      getPageData(pageNumber + 1);
    } else {
      await browser.close();
    }

    console.log(data);
  }

  getPageData();
}

run();
