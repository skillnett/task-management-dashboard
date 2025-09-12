module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@chakra-ui/react$': '<rootDir>/src/__mocks__/@chakra-ui/react.js',
    'proxy-compare': '<rootDir>/src/__mocks__/proxy-compare.js',
    '@zag-js/store': '<rootDir>/src/__mocks__/@zag-js/store.js',
    '@ark-ui/react': '<rootDir>/src/__mocks__/@ark-ui/react.js',
    '^../components/ui/color-mode$': '<rootDir>/src/__mocks__/color-mode.tsx',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts',
    '!src/test-utils.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(proxy-compare|@zag-js|@ark-ui|@chakra-ui)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testTimeout: 10000,
};
