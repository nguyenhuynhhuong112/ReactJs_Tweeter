export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)test.ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/*'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest',
  },
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  verbose: true,
  preset: 'ts-jest',
};
