const { setup: setupDevServer } = require("jest-dev-server");

module.exports = async function globalSetup() {
  await setupDevServer({
    command: `fuser -k 9229/tcp | yarn dev-server`,
    launchTimeout: 50000,
    port: process.env.PORT || 4000,
    debug: true,
  });
};
