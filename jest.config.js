// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [ '**/*.test.ts' ], // Find test files
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // for path aliases, if used.
  },
  collectCoverage: true,
  coverageReporters: [ "text", "html" ]
};