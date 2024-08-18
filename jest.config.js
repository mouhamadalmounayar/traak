globalThis.ngJest = {
  skipNgcc: true,
  tsconfig: "tsconfig.spec.json", // this is the project root tsconfig
};

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: "jest-preset-angular",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest", // Only transform .ts files
  },
  transformIgnorePatterns: [
    "/node_modules/(?!flat)/", // Exclude modules except 'flat' from transformation
  ],
  moduleDirectories: ["node_modules", "src"],
  collectCoverage: false,
  collectCoverageFrom: ["./src/**", "./projects/traak-editor/src/lib/**"],
};
