module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./dev-jest-server.ts",
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"]
};
