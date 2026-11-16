const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          module: "commonjs",
          moduleResolution: "node",
          target: "ESNext",
          allowJs: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          resolveJsonModule: true,
          isolatedModules: true,
        },
      },
    ],
  },
  setupFilesAfterEnv: [
    "jest-styled-components",
    "@testing-library/jest-dom",
    "<rootDir>/jest.setup.ts",
  ],
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svg.mock.js",
    "^react-merge-refs$": "<rootDir>/__mocks__/react-merge-refs.js",
  },
};

export default config;
