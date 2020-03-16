import { setup as setupDevServer } from "jest-dev-server";

global.open = false;

module.exports = async function globalSetup() {
  try {
    if (!global.open) {
      global.open = true;

      await setupDevServer({
        command: `yarn api-test`,
        launchTimeout: 50000,
        port: process.env.PORT ? parseInt(process.env.PORT) : 9999,
        waitOnScheme: {
          delay: 1000
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
};
