import puppeteer from "puppeteer";

export const createBrowserInstance = () =>
  new Promise<puppeteer.Browser>(async (resolve, reject) => {
    let tries = 0;
    const interval = setInterval(async () => {
      tries += 1;
      try {
        const browser = await puppeteer.launch({
          executablePath: process.env.CHROME_BIN,
          args: ["--no-sandbox"],
        });

        console.log("OK Browser");

        clearInterval(interval);
        resolve(browser);
      } catch (err) {
        console.log("Browser error try ", tries);
        if (tries === 10) {
          console.error(err);
          reject(err);
        }
      }
    }, 2000);
  });
