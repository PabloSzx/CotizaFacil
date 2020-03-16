module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./jest-server-dev.ts",
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"]
};
